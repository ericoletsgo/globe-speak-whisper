import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface CountryMarker {
  country: string;
  translation: string;
  position: [number, number, number];
}

interface GlobeProps {
  markers?: CountryMarker[];
}

const GlobeCore = ({ markers = [] }: GlobeProps) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
    }
  });

  // Create latitude lines
  const latitudeLines = [];
  for (let i = -80; i <= 80; i += 20) {
    const points = [];
    const lat = (i * Math.PI) / 180;
    const radius = Math.cos(lat) * 2;
    for (let j = 0; j <= 64; j++) {
      const lon = (j * Math.PI * 2) / 64;
      points.push(
        new THREE.Vector3(
          radius * Math.cos(lon),
          Math.sin(lat) * 2,
          radius * Math.sin(lon)
        )
      );
    }
    latitudeLines.push(points);
  }

  // Create longitude lines
  const longitudeLines = [];
  for (let i = 0; i < 16; i++) {
    const points = [];
    const lon = (i * Math.PI * 2) / 16;
    for (let j = 0; j <= 64; j++) {
      const lat = ((j - 32) * Math.PI) / 32;
      const radius = 2;
      points.push(
        new THREE.Vector3(
          radius * Math.cos(lat) * Math.cos(lon),
          radius * Math.sin(lat),
          radius * Math.cos(lat) * Math.sin(lon)
        )
      );
    }
    longitudeLines.push(points);
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d9ff" />
      
      <group ref={linesRef}>
        {/* Latitude lines */}
        {latitudeLines.map((points, i) => (
          <Line
            key={`lat-${i}`}
            points={points}
            color="#00d9ff"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
        ))}
        
        {/* Longitude lines */}
        {longitudeLines.map((points, i) => (
          <Line
            key={`lon-${i}`}
            points={points}
            color="#00d9ff"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
        ))}
      </group>

      {/* Globe sphere with transparency */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#001a2e"
          transparent
          opacity={0.2}
          shininess={100}
        />
      </Sphere>

      {/* Markers for translations */}
      {markers.map((marker, i) => (
        <group key={i}>
          <Sphere args={[0.05, 16, 16]} position={marker.position}>
            <meshBasicMaterial color="#00d9ff" />
          </Sphere>
          <pointLight
            position={marker.position}
            intensity={0.5}
            distance={1}
            color="#00d9ff"
          />
        </group>
      ))}
    </>
  );
};

export const Globe = ({ markers }: GlobeProps) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <GlobeCore markers={markers} />
      </Canvas>
    </div>
  );
};
