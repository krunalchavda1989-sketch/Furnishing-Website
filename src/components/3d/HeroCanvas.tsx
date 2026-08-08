import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Draped Silk Mesh component with dynamic mouse interaction
function DrapedSilk() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle organic wave movement mimicking fabric motion
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.15 + state.pointer.y * 0.2;
      meshRef.current.rotation.y = Math.cos(t * 0.2) * 0.2 + state.pointer.x * 0.3;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={[2.4, 2.8, 1.2]}>
        <torusKnotGeometry args={[1, 0.32, 128, 32]} />
        <MeshWobbleMaterial
          ref={materialRef}
          color="#C5A059"
          roughness={0.25}
          metalness={0.4}
          factor={0.4}
          speed={0.8}
        />
      </mesh>
    </Float>
  );
}

// Background Floating Material Swatch Spheres
function FloatingSwatches() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[-3.2, 1.5, -2]}>
        <mesh scale={0.7}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#1C3026" roughness={0.3} metalness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.2} position={[3.5, -1.2, -2.5]}>
        <mesh scale={0.85}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#3B1C1C" roughness={0.2} metalness={0.3} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.9} position={[-2.8, -2, -1.5]}>
        <mesh scale={0.6}>
          <cylinderGeometry args={[1, 1, 0.4, 32]} />
          <meshStandardMaterial color="#D8C8B8" roughness={0.6} metalness={0.1} />
        </mesh>
      </Float>
    </group>
  );
}

export const HeroCanvas: React.FC = () => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Detect reduced motion preferences or low device performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    if (prefersReducedMotion || isMobileDevice) {
      setIsLowPower(true);
    }
  }, []);

  if (isLowPower) {
    return (
      <div className="relative w-full h-full min-h-[480px] overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1600&q=85"
          alt="Maison & Drape Luxury Drapes"
          className="w-full h-full object-cover object-center filter brightness-90 transform hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/60 via-transparent to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/20">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full bg-gradient-to-b from-[#1A1918] via-[#242220] to-[#121110]"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFF8E7" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#C5A059" />
        <spotLight position={[0, 5, 8]} intensity={1.2} angle={0.4} penumbra={1} color="#EBE5D8" />
        
        <DrapedSilk />
        <FloatingSwatches />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
          rotateSpeed={0.4}
        />
      </Canvas>

      {/* Interactive Overlay Badge */}
      <div className="absolute bottom-6 right-6 hidden sm:flex items-center space-x-2 glass-panel-dark px-4 py-2 rounded-full text-xs text-[#EBE5D8] border border-[#C5A059]/30 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
        <span className="font-medium tracking-wide">Interactive 3D Drapery — Drag to Rotate</span>
      </div>
    </div>
  );
};
