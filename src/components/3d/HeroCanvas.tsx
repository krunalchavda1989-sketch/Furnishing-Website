import React, { useState } from 'react';
import { Sparkles, Eye, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

interface FurnishingScene {
  id: string;
  title: string;
  location: string;
  image: string;
  tagline: string;
  hotspots: {
    x: number; // percentage
    y: number; // percentage
    label: string;
    detail: string;
    origin: string;
  }[];
}

const SCENES: FurnishingScene[] = [
  {
    id: 'belgravia',
    title: 'Belgravia Grand Salon',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Floor-to-ceiling acoustic linen drapes paired with hand-knotted silk rugs.',
    hotspots: [
      {
        x: 28,
        y: 35,
        label: 'Acoustic Sheer Drapes',
        detail: 'Fluid Belgian flax with 82% ambient sound attenuation.',
        origin: 'Kortrijk, Belgium'
      },
      {
        x: 62,
        y: 60,
        label: 'Tailored Mohair Lounge',
        detail: 'Hand-dyed Florentine mohair velvet with 100,000 Martindale durability.',
        origin: 'Florence, Italy'
      },
      {
        x: 48,
        y: 82,
        label: 'Botanical Relief Rug',
        detail: 'Hand-knotted Himalayan wool & mulberry silk at 150 knots/sq.in.',
        origin: 'Kathmandu, Nepal'
      }
    ]
  },
  {
    id: 'como',
    title: 'Como Lakefront Villa',
    location: 'Lombardy, Italy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Light-responsive woven timber shades & raw Como silk window treatments.',
    hotspots: [
      {
        x: 35,
        y: 30,
        label: 'Architectural Timber Shade',
        detail: 'Precision basswood slats woven with metallic copper filaments.',
        origin: 'Kyoto, Japan'
      },
      {
        x: 70,
        y: 52,
        label: 'Como Spun Silk Panels',
        detail: 'Lustrous raw silk woven on 19th-century jacquard looms.',
        origin: 'Como, Italy'
      }
    ]
  },
  {
    id: 'mayfair',
    title: 'Mayfair Penthouse Suite',
    location: 'Mayfair, London',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Padded silk-cashmere headboards & 1000-thread-count Giza cotton percale.',
    hotspots: [
      {
        x: 50,
        y: 45,
        label: 'Quilted Cashmere Headboard',
        detail: 'Hand-tufted silk & cashmere topper with brass nailhead trim.',
        origin: 'Milan, Italy'
      },
      {
        x: 25,
        y: 70,
        label: 'Percale Bedding Suite',
        detail: 'Giza 45 extra-long staple Egyptian cotton with hand-hemstitched borders.',
        origin: 'Tuscany, Italy'
      }
    ]
  }
];

export const HeroCanvas: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  const currentScene = SCENES[activeSceneIndex];

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/30 bg-[#1A1918]">
      {/* Background Professional Furnishing Image */}
      <img
        key={currentScene.id}
        src={currentScene.image}
        alt={currentScene.title}
        className="w-full h-full object-cover filter brightness-95 animate-in fade-in duration-700 transition-transform duration-1000 scale-100 hover:scale-105"
      />

      {/* Luxury Gradient Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-transparent to-[#1A1918]/40"></div>

      {/* Top Scene Switcher Pills */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center space-x-2 glass-panel-dark px-4 py-2 rounded-full border border-[#C5A059]/40 shadow-lg">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs uppercase tracking-widest text-[#FDFBF7] font-semibold">
            Haute Furnishing Portfolio
          </span>
        </div>

        <div className="flex items-center space-x-2 glass-panel-dark p-1.5 rounded-full border border-white/10 shadow-lg">
          {SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setActiveHotspot(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeSceneIndex === idx
                  ? 'bg-[#C5A059] text-[#1A1918] shadow-md'
                  : 'text-[#EBE5D8] hover:text-[#C5A059] hover:bg-white/5'
              }`}
            >
              {scene.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Material Hotspot Pins */}
      {currentScene.hotspots.map((spot, idx) => {
        const isActive = activeHotspot === idx;
        return (
          <div
            key={idx}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group"
          >
            <button
              onClick={() => setActiveHotspot(isActive ? null : idx)}
              className="relative flex items-center justify-center focus:outline-none"
              aria-label={`Inspect ${spot.label}`}
            >
              <span className="absolute w-8 h-8 rounded-full bg-[#C5A059]/40 animate-ping"></span>
              <span
                className={`w-6 h-6 rounded-full border-2 border-[#FDFBF7] flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isActive ? 'bg-[#C5A059] scale-125' : 'bg-[#1A1918]/80 hover:bg-[#C5A059]'
                }`}
              >
                <Eye className={`w-3.5 h-3.5 ${isActive ? 'text-[#1A1918]' : 'text-[#C5A059]'}`} />
              </span>
            </button>

            {/* Hotspot Floating Detail Card */}
            {isActive && (
              <div className="absolute left-1/2 bottom-full mb-3 transform -translate-x-1/2 w-64 glass-panel-dark rounded-2xl p-4 border border-[#C5A059]/40 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#C5A059]" /> {spot.origin}
                  </span>
                  <span className="text-[9px] text-[#8C7A6B] uppercase font-mono">Bespoke Mill</span>
                </div>
                <h5 className="font-serif text-sm font-semibold text-[#FDFBF7]">{spot.label}</h5>
                <p className="text-xs text-[#D8C8B8] mt-1 font-light leading-relaxed">
                  {spot.detail}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom Scene Info Banner */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="glass-panel-dark rounded-2xl p-5 border border-[#C5A059]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-[#C5A059] uppercase tracking-widest font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentScene.location}</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl text-[#FDFBF7] font-normal">
              {currentScene.title}
            </h4>
            <p className="text-xs text-[#D8C8B8] font-light max-w-xl">
              {currentScene.tagline}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase tracking-widest text-[#8C7A6B] block font-medium">
                Hotspots
              </span>
              <span className="text-xs text-[#C5A059] font-mono font-bold">
                {currentScene.hotspots.length} Specifications Pinpointed
              </span>
            </div>

            <button
              onClick={() =>
                setActiveSceneIndex((prev) => (prev + 1) % SCENES.length)
              }
              className="p-3 rounded-full bg-[#C5A059] text-[#1A1918] hover:bg-[#D4AF37] transition-all shadow-md flex items-center justify-center"
              title="Next Scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

