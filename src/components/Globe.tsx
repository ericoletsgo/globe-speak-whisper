import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number]; // [longitude, latitude, altitude]
}

interface GlobeProps {
  markers?: CountryMarker[];
}

export const Globe = ({ markers = [] }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set your Mapbox access token
    // Replace 'XXXX' below with your actual Mapbox access token
    // Get your token from https://account.mapbox.com/access-tokens/
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'XXXX';
    
    if (!accessToken || accessToken === 'XXXX') {
      console.warn('Please replace XXXX with your actual Mapbox access token in src/components/Globe.tsx');
    }
    
    mapboxgl.accessToken = accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      projection: 'globe',
      zoom: 1,
      center: [0, 0],
      pitch: 0,
      bearing: 0
    });

    const currentMap = map.current;

    currentMap.addControl(new mapboxgl.NavigationControl());
    // Enable native scroll zoom for smooth Google Earth-like experience
    currentMap.scrollZoom.enable();
    currentMap.doubleClickZoom.enable();

    currentMap.on('style.load', () => {
      currentMap.setFog({});
      setIsLoaded(true);
    });

    // Prevent page scrolling when scrolling on the map container
    currentMap.getContainer().addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    return () => {
      if (currentMap) {
        currentMap.remove();
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapbox-gl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    markers.forEach((marker) => {
      const [lng, lat] = marker.position;
      
      const markerEl = document.createElement('div');
      markerEl.className = 'mapbox-gl-marker';
      markerEl.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #00d9ff;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      // Add pulse animation CSS
      if (!document.getElementById('marker-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'marker-pulse-animation';
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <div class="font-semibold text-sm text-primary mb-1">${marker.country}</div>
            <div class="text-xs text-muted-foreground">${marker.translation}</div>
          </div>
        `);

      new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [markers, isLoaded]);

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          minHeight: '65vh',
          borderRadius: '8px'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading globe...</p>
          </div>
        </div>
      )}
    </div>
  );
};
