import React, { useState } from 'react';
import { Sparkles, Eye, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { FurnishingScene } from '../../types';
import { DEFAULT_HERO_SLIDES } from '../../lib/supabase';

interface HeroCanvasProps {
  slides?: FurnishingScene[];
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ slides }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  const rawScenes = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const scenes = rawScenes.filter((s) => s.isVisible !== false);
  const validScenes = scenes.length > 0 ? scenes : DEFAULT_HERO_SLIDES;

  const safeIndex = activeSceneIndex < validScenes.length ? activeSceneIndex : 0;
  const currentScene = validScenes[safeIndex];

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A56A]/30 bg-[#0F1714]">
      {/* Background Professional Furnishing Image */}
      <img
        key={currentScene.id}
        src={currentScene.image}
        alt={currentScene.title}
        className="w-full h-full object-cover filter brightness-95 animate-in fade-in duration-700 transition-transform duration-1000 scale-100 hover:scale-105"
      />

      {/* Luxury Gradient Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-transparent to-[#163129]/50"></div>

      {/* Top Scene Switcher Pills */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center space-x-2 glass-panel-dark px-4 py-2 rounded-full border border-[#C9A56A]/40 shadow-lg">
          <Sparkles className="w-4 h-4 text-[#C9A56A]" />
          <span className="text-xs uppercase tracking-widest text-[#E9DFD1] font-semibold">
            Haute Furnishing Portfolio
          </span>
        </div>

        <div className="flex items-center space-x-2 glass-panel-dark p-1.5 rounded-full border border-white/10 shadow-lg max-w-full overflow-x-auto">
          {validScenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveSceneIndex(idx);
                setActiveHotspot(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                safeIndex === idx
                  ? 'bg-[#C9A56A] text-[#0F1714] shadow-md'
                  : 'text-[#E9DFD1] hover:text-[#C9A56A] hover:bg-white/5'
              }`}
            >
              {scene.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Material Hotspot Pins */}
      {currentScene.hotspots &&
        currentScene.hotspots.map((spot, idx) => {
          const isActive = activeHotspot === idx;
          return (
            <div
              key={spot.id || idx}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <button
                onClick={() => setActiveHotspot(isActive ? null : idx)}
                className="relative flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label={`Inspect ${spot.label}`}
              >
                <span className="absolute w-8 h-8 rounded-full bg-[#C9A56A]/40 animate-ping"></span>
                <span
                  className={`w-6 h-6 rounded-full border-2 border-[#E9DFD1] flex items-center justify-center shadow-2xl transition-all duration-300 ${
                    isActive ? 'bg-[#C9A56A] scale-125' : 'bg-[#0F1714]/80 hover:bg-[#C9A56A]'
                  }`}
                >
                  <Eye className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F1714]' : 'text-[#C9A56A]'}`} />
                </span>
              </button>

              {/* Hotspot Floating Detail Card */}
              {isActive && (
                <div className="absolute left-1/2 bottom-full mb-3 transform -translate-x-1/2 w-64 glass-panel-dark rounded-2xl p-4 border border-[#C9A56A]/40 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#C9A56A]" /> {spot.origin}
                    </span>
                    <span className="text-[9px] text-[#8C9A90] uppercase font-mono">Bespoke Mill</span>
                  </div>
                  <h5 className="font-serif text-sm font-semibold text-[#E9DFD1]">{spot.label}</h5>
                  <p className="text-xs text-[#8C9A90] mt-1 font-light leading-relaxed">
                    {spot.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}

      {/* Bottom Scene Info Banner */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="glass-panel-dark rounded-2xl p-5 border border-[#C9A56A]/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-[#C9A56A] uppercase tracking-widest font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentScene.location}</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl text-[#E9DFD1] font-normal">
              {currentScene.title}
            </h4>
            <p className="text-xs text-[#8C9A90] font-light max-w-xl">
              {currentScene.tagline}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase tracking-widest text-[#8C9A90] block font-medium">
                Hotspots
              </span>
              <span className="text-xs text-[#C9A56A] font-mono font-bold">
                {currentScene.hotspots?.length || 0} Specifications Pinpointed
              </span>
            </div>

            <button
              onClick={() =>
                setActiveSceneIndex((prev) => (prev + 1) % validScenes.length)
              }
              className="p-3 rounded-full bg-[#C9A56A] text-[#0F1714] hover:bg-[#E6C894] transition-all shadow-md flex items-center justify-center cursor-pointer"
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
