/**
 * 3D Globe component using react-globe.gl
 *
 * Uses the built-in `labelsData` layer (WebGL text sprites) instead of
 * HTML overlays.  This avoids CSS2DRenderer issues that can freeze the
 * Three.js render loop.
 *
 * • Click any label → hear the pronunciation via Web Speech API
 * • Hover any label → info tooltip in the corner
 * • Zoom in/out    → more/fewer labels appear (tier system)
 */
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import GlobeGL from 'react-globe.gl';
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
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [zoomTier, setZoomTier] = useState<1 | 2 | 3>(1);
  const [ready, setReady] = useState(false);
  const [activeLabel, setActiveLabel] = useState<GlobeLabelData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
          _size: d.tier === 1 ? 1.6 : d.tier === 2 ? 1.1 : 0.75,
          _dotR: d.tier === 1 ? 0.4 : d.tier === 2 ? 0.3 : 0.2,
        })),
    [labels, zoomTier],
  );

  /* ── Label click → speak pronunciation ── */
  const handleLabelClick = useCallback((label: any) => {
    if (!label) return;
    speechService.speak(label.translation, label.languageCode);
    setActiveLabel(label);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2500);
  }, []);

  /* ── Label hover → show tooltip ── */
  const handleLabelHover = useCallback((label: any) => {
    if (label) {
      setActiveLabel(label);
      setIsSpeaking(false);
    } else {
      // small delay so the tooltip doesn't flicker off instantly
      setTimeout(() => setActiveLabel(prev => (prev === label ? null : prev)), 600);
    }
  }, []);

  /* ── Render ── */
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {dims.w > 0 && dims.h > 0 && (
        <GlobeGL
          ref={globeEl}
          width={dims.w}
          height={dims.h}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="lightskyblue"
          atmosphereAltitude={0.15}
          animateIn={true}
          labelsData={visibleLabels}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.translation}
          labelSize={(d: any) => d._size}
          labelColor={() => 'rgba(220, 240, 255, 0.95)'}
          labelDotRadius={(d: any) => d._dotR}
          labelDotOrientation={() => 'bottom' as const}
          labelAltitude={0.015}
          labelResolution={3}
          onLabelClick={handleLabelClick}
          onLabelHover={handleLabelHover}
          onGlobeReady={() => setReady(true)}
        />
      )}

      {/* ── Info tooltip (top-right corner) ── */}
      {activeLabel && (
        <div className="absolute top-4 right-4 z-20 bg-black/75 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 shadow-2xl min-w-[180px] pointer-events-none select-none">
          <p className="text-white font-semibold text-base" dir="auto">
            {activeLabel.translation}
          </p>
          <p className="text-sky-300/60 text-xs mt-0.5">
            {activeLabel.country} · {activeLabel.language}
          </p>
          {isSpeaking ? (
            <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
              <span className="inline-block animate-pulse">🔊</span> Speaking…
            </p>
          ) : (
            <p className="text-white/30 text-[10px] mt-1.5">
              Click a label to hear it pronounced
            </p>
          )}
        </div>
      )}

      {/* ── Hint bar (when labels are shown) ── */}
      {labels.length > 0 && !isLoading && (
        <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none z-10">
          <span className="text-[10px] text-white/20 select-none">
            🔊 Click any translation to hear it · Scroll to zoom
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
