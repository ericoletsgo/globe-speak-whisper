import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TranslationLabels } from './TranslationLabels';
import { translationService, COUNTRY_LANGUAGES, LANGUAGE_GROUPS, ZOOM_LEVELS } from '@/services/translationService';
import { ALL_COUNTRIES, CountryData } from '@/data/countries';

// Helper function to get coordinates for countries from comprehensive database
const getCountryCoordinates = (country: string): [number, number] | null => {
  const countryData = ALL_COUNTRIES.find(c => c.name === country);
  return countryData ? countryData.coordinates : null;
};

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number]; // [longitude, latitude, altitude]
}

interface GlobeProps {
  markers?: CountryMarker[];
  translationText?: string;
}

export const Globe = ({ markers = [], translationText }: GlobeProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [translationLabels, setTranslationLabels] = useState<any[]>([]);

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

    // Track zoom level changes
    const updateZoomLevel = () => {
      const zoom = currentMap.getZoom();
      setZoomLevel(zoom);
    };

    currentMap.on('zoom', updateZoomLevel);
    currentMap.on('moveend', updateZoomLevel);

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

  // Generate translation labels based on zoom level and translation text
  useEffect(() => {
    if (!translationText || !isLoaded || !map.current) {
      setTranslationLabels([]);
      return;
    }

    const generateLabels = async () => {
      try {
        const sourceLang = translationService.detectLanguage(translationText);
        
        // Get countries based on zoom level
        let countriesToShow: string[];
        if (zoomLevel < ZOOM_LEVELS.MEDIUM) {
          // Low zoom: show only major countries per language group
          countriesToShow = Object.keys(LANGUAGE_GROUPS).map(lang => {
            const countries = LANGUAGE_GROUPS[lang];
            return countries[0]; // Return first country as representative
          });
        } else {
          // Medium and high zoom: show all countries
          countriesToShow = ALL_COUNTRIES.map(country => country.name);
        }
        
        const labels = [];
        
        for (const country of countriesToShow) {
          const countryData = ALL_COUNTRIES.find(c => c.name === country);
          if (countryData) {
            const translation = await translationService.translateText(
              translationText, 
              sourceLang, 
              countryData.languageCode
            );
            
            // Get country coordinates
            const coordinates = getCountryCoordinates(country);
            if (coordinates) {
              labels.push({
                id: `${country}-${countryData.languageCode}`,
                text: translation,
                position: coordinates,
                language: countryData.language,
                country: country,
                pronunciation: countryData.pronunciation,
              });
            }
          }
        }
        
        setTranslationLabels(labels);
      } catch (error) {
        console.error('Error generating translation labels:', error);
      }
    };

    generateLabels();
  }, [translationText, zoomLevel, isLoaded]);

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
      <TranslationLabels 
        map={map.current} 
        labels={translationLabels} 
        zoomLevel={zoomLevel} 
      />
    </div>
  );
};
