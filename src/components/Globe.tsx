/**
 * 3D Globe with React-rendered label overlay.
 *
 * Globe.gl's built-in label systems are avoided entirely:
 *   – `labelsData` (WebGL sprites) can't render CJK / Arabic / Devanagari
 *   – `htmlElementsData` (CSS2DRenderer) crashes the Three.js render loop
 *
 * Instead we:
 *   1. Render the globe with NO label layer (just the earth).
 *   2. Overlay a React `<div>` on top of the canvas.
 *   3. Use Three.js math (`Vector3.project(camera)`) to position each label
 *      on every animation frame via direct DOM manipulation (no React
 *      re-render per frame).
 *   4. Dot-product back-face culling hides labels on the far side.
 *
 * The globe also displays country border polygons loaded from the
 * Natural Earth dataset (world-atlas TopoJSON → GeoJSON features).
 */
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GlobeGL from 'react-globe.gl';
import { Vector3 } from 'three';
import { feature } from 'topojson-client';
import { Volume2 } from 'lucide-react';
import { speechService } from '@/services/speechService';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GlobeLabelData {
  id: string;
  lat: number;
  lng: number;
  translation: string;
  language: string;
  country: string;
  languageCode: string;
  tier: number;
}

interface GlobeProps {
  labels: GlobeLabelData[];
  isLoading?: boolean;
  onZoomTierChange?: (tier: 1 | 2 | 3) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Globe = ({ labels, isLoading, onZoomTierChange }: GlobeProps) => {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLDivElement>());
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [zoomTier, setZoomTier] = useState<1 | 2 | 3>(1);
  const [ready, setReady] = useState(false);
  const [activeLabel, setActiveLabel] = useState<GlobeLabelData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);

  /* ── Load country border polygons ── */
  useEffect(() => {
    fetch('//unpkg.com/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        const geo = feature(topo, topo.objects.countries) as any;
        setCountries(geo.features);
      })
      .catch(() => {}); // silent fail – borders are cosmetic
  }, []);

  /* ── Track container size ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setDims({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Initial camera & controls ── */
  useEffect(() => {
    if (!ready || !globeEl.current) return;
    globeEl.current.pointOfView({ lat: 25, lng: -20, altitude: 2.5 }, 1200);
    const c = globeEl.current.controls();
    if (c) {
      c.autoRotate = true;
      c.autoRotateSpeed = 0.35;
      c.enableDamping = true;
      c.dampingFactor = 0.12;
    }
  }, [ready]);

  /* ── Toggle auto-rotate ── */
  useEffect(() => {
    if (!ready || !globeEl.current) return;
    const c = globeEl.current.controls();
    if (c) c.autoRotate = labels.length === 0;
  }, [labels.length, ready]);

  /* ── Zoom-tier tracking ── */
  useEffect(() => {
    if (!ready || !globeEl.current) return;
    const controls = globeEl.current.controls();
    if (!controls) return;
    let raf: number;
    const onChange = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pov = globeEl.current?.pointOfView?.();
        if (!pov) return;
        const alt: number = pov.altitude;
        const t: 1 | 2 | 3 = alt > 1.8 ? 1 : alt > 0.6 ? 2 : 3;
        setZoomTier(prev => (prev !== t ? t : prev));
      });
    };
    controls.addEventListener('change', onChange);
    return () => {
      controls.removeEventListener('change', onChange);
      cancelAnimationFrame(raf);
    };
  }, [ready]);

  /* ── Notify parent of tier changes (debounced) ── */
  useEffect(() => {
    if (!onZoomTierChange) return;
    const id = setTimeout(() => onZoomTierChange(zoomTier), 400);
    return () => clearTimeout(id);
  }, [zoomTier, onZoomTierChange]);

  /* ── Visible labels filtered by tier ── */
  const visibleLabels = useMemo(
    () =>
      labels
        .filter(d => d.tier <= zoomTier)
        .map(d => ({
          ...d,
          _sub: zoomTier === 1 ? d.language : d.country,
          _fontSize: d.tier === 1 ? 14 : d.tier === 2 ? 12 : 10,
        })),
    [labels, zoomTier],
  );

  /* ──────────────────────────────────────────────────────────────────────────
     ANIMATION LOOP  –  project lat/lng → screen coords via Three.js math.
     Direct DOM updates (no React re-render).
     ────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !globeEl.current) return;

    const _pos = new Vector3();
    const _norm = new Vector3();
    const _cam = new Vector3();

    let running = true;
    let frame = 0;

    const tick = () => {
      if (!running || !globeEl.current) return;
      requestAnimationFrame(tick);

      if (++frame & 1) return;

      const globe = globeEl.current;
      const camera = globe.camera();
      if (!camera) return;

      _cam.copy(camera.position).normalize();
      const w = dims.w;
      const h = dims.h;

      labelRefs.current.forEach(el => {
        const lat = Number(el.dataset.lat);
        const lng = Number(el.dataset.lng);

        let coords: { x: number; y: number; z: number };
        try {
          coords = globe.getCoords(lat, lng, 0.02);
        } catch {
          el.style.display = 'none';
          return;
        }

        _pos.set(coords.x, coords.y, coords.z);
        _norm.copy(_pos).normalize();
        const dot = _norm.dot(_cam);
        if (dot < 0.2) {
          el.style.display = 'none';
          return;
        }

        _pos.project(camera);
        const sx = (_pos.x * 0.5 + 0.5) * w;
        const sy = (-(_pos.y * 0.5) + 0.5) * h;

        if (sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80) {
          el.style.display = 'none';
          return;
        }

        const opacity = Math.min(1, (dot - 0.2) * 5);
        el.style.display = '';
        el.style.opacity = String(opacity);
        el.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
      });
    };

    requestAnimationFrame(tick);
    return () => {
      running = false;
    };
  }, [ready, dims.w, dims.h, visibleLabels]);

  /* ── Click handler ── */
  const speakTimer = useRef<ReturnType<typeof setTimeout>>();
  const handleSpeak = useCallback((d: GlobeLabelData) => {
    setActiveLabel(d);
    setIsSpeaking(true);
    clearTimeout(speakTimer.current);
    speakTimer.current = setTimeout(() => setIsSpeaking(false), 10000);
    speechService.speak(d.translation, d.languageCode, () => {
      clearTimeout(speakTimer.current);
      setIsSpeaking(false);
    });
  }, []);

  /* ── Render ── */
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* 3D Globe – satellite texture + country border polygons */}
      {dims.w > 0 && dims.h > 0 && (
        <GlobeGL
          ref={globeEl}
          width={dims.w}
          height={dims.h}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="lightskyblue"
          atmosphereAltitude={0.18}
          animateIn={true}
          onGlobeReady={() => setReady(true)}
          // ── Country border polygons ──
          polygonsData={countries}
          polygonCapColor={() => 'rgba(0, 0, 0, 0)'}
          polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
          polygonStrokeColor={() => 'rgba(180, 220, 255, 0.35)'}
          polygonAltitude={0.002}
        />
      )}

      {/* ── React label overlay ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
        {visibleLabels.map(d => (
          <div
            key={d.id}
            ref={el => {
              if (el) labelRefs.current.set(d.id, el);
              else labelRefs.current.delete(d.id);
            }}
            data-lat={d.lat}
            data-lng={d.lng}
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer text-center"
            style={{ display: 'none', willChange: 'transform, opacity' }}
            onClick={() => handleSpeak(d)}
            onMouseEnter={() => {
              setActiveLabel(d);
              setIsSpeaking(false);
            }}
          >
            <div
              dir="auto"
              style={{
                color: '#fff',
                fontSize: d._fontSize,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                lineHeight: 1.25,
                textShadow:
                  '0 0 7px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)',
                fontFamily:
                  '"Segoe UI", system-ui, -apple-system, "Noto Sans", "Noto Sans CJK SC", "Noto Sans Arabic", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                background: 'rgba(0,0,0,0.35)',
                borderRadius: 4,
                padding: '1px 5px',
              }}
            >
              {d.translation}
            </div>
            <div
              style={{
                color: 'rgba(170,210,255,0.5)',
                fontSize: 9,
                whiteSpace: 'nowrap',
                lineHeight: 1.1,
                marginTop: 1,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {d._sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Info tooltip (top-right) ── */}
      {activeLabel && (
        <div
          className="absolute top-4 right-4 z-20 bg-black/75 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 shadow-2xl min-w-[180px] pointer-events-none select-none"
        >
          <p className="text-white font-semibold text-base" dir="auto">
            {activeLabel.translation}
          </p>
          <p className="text-sky-300/60 text-xs mt-0.5">
            {activeLabel.country} · {activeLabel.language}
          </p>
          {isSpeaking ? (
            <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1.5">
              <Volume2 size={13} className="animate-pulse" /> Speaking…
            </p>
          ) : (
            <p className="text-white/50 text-[10px] mt-1.5 flex items-center gap-1">
              <Volume2 size={10} /> Click a label to hear it
            </p>
          )}
        </div>
      )}

      {/* ── Hint bar ── */}
      {labels.length > 0 && !isLoading && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none z-10">
          <span className="text-[10px] text-white/40 select-none inline-flex items-center gap-1">
            <Volume2 size={10} /> Click any translation to hear it · Scroll to zoom
          </span>
        </div>
      )}

      {/* ── Loading overlay ── */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl px-8 py-5 text-center border border-white/10 shadow-2xl">
            <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-sky-200/80 font-medium">
              Translating across the globe…
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
