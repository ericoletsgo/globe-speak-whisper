import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface TranslationLabel {
  id: string;
  text: string;
  position: [number, number];
  language: string;
  country: string;
  pronunciation?: string;
}

interface TranslationLabelsProps {
  map: mapboxgl.Map | null;
  labels: TranslationLabel[];
  zoomLevel: number;
}

export const TranslationLabels = ({ map, labels, zoomLevel }: TranslationLabelsProps) => {
  const labelsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (!map) return;

    const container = map.getContainer();
    
    // Clear existing labels
    labelsRef.current.forEach(label => {
      if (label.parentNode) {
        label.parentNode.removeChild(label);
      }
    });
    labelsRef.current.clear();

    // Add new labels
    labels.forEach(label => {
      const labelEl = document.createElement('div');
      labelEl.className = 'translation-label';
      
      // Create label content with pronunciation if available
      const labelContent = label.pronunciation 
        ? `${label.text}\n[${label.pronunciation}]`
        : label.text;
      
      labelEl.textContent = labelContent;
      labelEl.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(4px);
        max-width: 200px;
        word-wrap: break-word;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      `;

      // Position the label
      const point = map.project(label.position);
      labelEl.style.left = `${point.x}px`;
      labelEl.style.top = `${point.y}px`;
      labelEl.style.transform = 'translate(-50%, -50%)';

      container.appendChild(labelEl);
      labelsRef.current.set(label.id, labelEl);
    });

    // Update label positions when map moves
    const updatePositions = () => {
      labels.forEach(label => {
        const labelEl = labelsRef.current.get(label.id);
        if (labelEl) {
          const point = map.project(label.position);
          
          // Check if the label is on the back side of the globe using distance from center
          const container = map.getContainer();
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          
          // Calculate distance from map center to projected point
          const distanceFromCenter = Math.sqrt(
            Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
          );
          
          // Calculate the maximum distance (radius) for the visible hemisphere
          const maxDistance = Math.min(containerWidth, containerHeight) * 0.6;
          
          // If the point is too far from center, it's likely on the back side
          const isOnBackSide = distanceFromCenter > maxDistance;
          
          // Also check if the point is outside reasonable bounds
          const isOutsideViewport = point.x < -300 || point.x > containerWidth + 300 ||
                                   point.y < -300 || point.y > containerHeight + 300;
          
          if (!isOnBackSide && !isOutsideViewport) {
            labelEl.style.left = `${point.x}px`;
            labelEl.style.top = `${point.y}px`;
            labelEl.style.transform = 'translate(-50%, -50%)';
            labelEl.style.display = 'block';
          } else {
            labelEl.style.display = 'none';
          }
        }
      });
    };

    map.on('move', updatePositions);
    map.on('zoom', updatePositions);

    return () => {
      // Cleanup
      labelsRef.current.forEach(label => {
        if (label.parentNode) {
          label.parentNode.removeChild(label);
        }
      });
      labelsRef.current.clear();
      
      map.off('move', updatePositions);
      map.off('zoom', updatePositions);
    };
  }, [map, labels, zoomLevel]);

  return null; // This component doesn't render anything visible
};
