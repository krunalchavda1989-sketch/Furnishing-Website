import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { SwatchColor } from '../../types';
import { RotateCcw, Play, Pause, Layers, Sparkles } from 'lucide-react';

interface SwatchViewer3DProps {
  swatchType: 'linen' | 'velvet' | 'leather' | 'silk' | 'weave' | 'marble' | 'wood';
  colors: SwatchColor[];
  productName: string;
}

function SwatchMesh({
  color,
  roughness,
  metalness,
  swatchType,
  autoRotate
}: {
  color: string;
  roughness: number;
  metalness: number;
  swatchType: string;
  autoRotate: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      {swatchType === 'wood' || swatchType === 'marble' ? (
        <boxGeometry args={[2, 2.8, 0.25]} />
      ) : (
        <cylinderGeometry args={[1.2, 1.2, 2.2, 64]} />
      )}
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        wireframe={false}
      />
    </mesh>
  );
}

export const SwatchViewer3D: React.FC<SwatchViewer3DProps> = ({
  swatchType,
  colors,
  productName
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const activeColor = colors[selectedColorIndex] || {
    name: 'Default',
    hex: '#C5A059',
    roughness: 0.4,
    metalness: 0.1
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="bg-[#1A1918] rounded-2xl border border-[#C5A059]/30 p-6 text-[#FDFBF7] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#C5A059]/20">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive 3D Texture Studio
          </span>
          <h4 className="font-serif text-xl text-[#FDFBF7] mt-1">{productName}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              autoRotate
                ? 'bg-[#C5A059] text-[#1A1918] border-[#C5A059]'
                : 'bg-transparent text-[#EBE5D8] border-[#C5A059]/40 hover:border-[#C5A059]'
            }`}
            title="Toggle 360° Rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRotate ? 'Pause' : 'Rotate'}</span>
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-lg border border-[#C5A059]/40 text-[#EBE5D8] hover:border-[#C5A059] transition-all text-xs flex items-center gap-1"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-gradient-to-b from-[#111010] to-[#1E1D1B]">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={50} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} color="#FFF5E1" />
          <pointLight position={[-5, -4, -2]} intensity={0.6} color="#C5A059" />
          
          <SwatchMesh
            color={activeColor.hex}
            roughness={activeColor.roughness ?? 0.4}
            metalness={activeColor.metalness ?? 0.1}
            swatchType={swatchType}
            autoRotate={autoRotate}
          />
          
          <OrbitControls ref={controlsRef} enableZoom={true} minDistance={2.5} maxDistance={6} />
        </Canvas>

        {/* Material Specs Badge */}
        <div className="absolute bottom-3 left-3 bg-[#1A1918]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C5A059]/20 text-[11px] text-[#D8C8B8] flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Texture: <strong className="text-[#FDFBF7] capitalize">{swatchType}</strong></span>
        </div>
      </div>

      {/* Color Selector Controls */}
      <div className="mt-5">
        <label className="text-xs uppercase tracking-widest text-[#D8C8B8] block mb-2 font-medium">
          Select Colorway: <span className="text-[#C5A059] font-normal">{activeColor.name}</span>
        </label>
        <div className="flex items-center space-x-3 overflow-x-auto pb-1">
          {colors.map((color, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColorIndex(idx)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${
                selectedColorIndex === idx
                  ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#FDFBF7] ring-2 ring-[#C5A059]/40'
                  : 'border-white/10 bg-white/5 text-[#D8C8B8] hover:border-white/30'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-black/30 shadow-inner"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
