import React, { useState } from 'react';
import { Compass, Feather, HeartHandshake, Sparkles, Award, BookOpen, ShieldCheck, History, TrendingUp } from 'lucide-react';
import type { StorySettings } from '../types';
import { DEFAULT_STORY_SETTINGS } from '../lib/supabase';

interface StoryPageProps {
  storySettings?: StorySettings;
}

const ICON_MAP: Record<string, any> = {
  Feather,
  Sparkles,
  Compass,
  HeartHandshake,
  Award,
  BookOpen,
  ShieldCheck,
  History,
  TrendingUp
};

export const StoryPage: React.FC<StoryPageProps> = ({ storySettings }) => {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const data = storySettings || DEFAULT_STORY_SETTINGS;

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-24">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block">
          {data.heroBadge || 'Our Heritage & Craftsmanship'}
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] font-normal leading-tight">
          {data.heroHeading || 'A Century of Tactile Mastery & Spatial Poetry'}
        </h1>
        <p className="text-base text-[#2C3A33] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          {data.heroSubheading}
        </p>

        {data.heroYear && (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A56A]/40 bg-[#C9A56A]/10 text-xs font-mono font-bold text-[#C9A56A] uppercase tracking-widest">
            <span>{data.heroYear}</span>
          </div>
        )}
      </section>

      {/* Main Narrative Split / Founder Ethos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#E9DFD1] rounded-3xl p-8 lg:p-12 border border-[#C9A56A]/20 shadow-xl">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
              {data.ethosBadge || 'The Founder’s Ethos'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1714] font-normal leading-snug">
              &ldquo;{data.ethosQuote}&rdquo;
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#2C3A33] leading-relaxed font-light">
              <p>{data.ethosDescription1}</p>
              {data.ethosDescription2 && <p>{data.ethosDescription2}</p>}
            </div>
            <div className="pt-4 border-t border-[#DFD5C5]">
              <strong className="block font-serif text-base text-[#0F1714]">{data.ethosAuthor}</strong>
              <span className="text-xs text-[#8C9A90]">{data.ethosRole}</span>
            </div>
          </div>

          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A56A]/20">
            <img
              src={data.ethosImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'}
              alt={data.ethosAuthor}
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>
        </div>
      </section>

      {/* Craft Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium">
            Material Integrity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1714]">
            {data.pillarsTitle || 'Four Cornerstones of Our Sourcing'}
          </h2>
          {data.pillarsSubtitle && (
            <p className="text-xs text-[#8C9A90]">{data.pillarsSubtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.pillars || []).map((pillar, idx) => {
            const iconKey = pillar.icon || pillar.iconName || 'Award';
            const Icon = (iconKey && ICON_MAP[iconKey]) || Award;
            return (
              <div
                key={pillar.id || idx}
                className="bg-[#0F1714] text-[#E9DFD1] p-6 rounded-3xl border border-[#C9A56A]/30 shadow-xl space-y-4 hover:border-[#C9A56A] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#C9A56A]/20 border border-[#C9A56A] flex items-center justify-center text-[#C9A56A]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl text-[#E9DFD1]">{pillar.title}</h3>
                <p className="text-xs text-[#8C9A90] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Heritage Timeline Milestones */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium">
            Chronology of Excellence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1714]">
            {data.timelineTitle || 'Our Historic Milestones'}
          </h2>
          {data.timelineSubtitle && (
            <p className="text-xs text-[#8C9A90]">{data.timelineSubtitle}</p>
          )}
        </div>

        <div className="relative border-l border-[#C9A56A]/40 ml-4 sm:ml-32 space-y-12">
          {(data.milestones || []).map((m, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0F1714] border-2 border-[#C9A56A]" />

              {/* Year label for desktop */}
              <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
                <span className="font-serif text-2xl text-[#C9A56A] font-bold">{m.year}</span>
              </div>

              <div className="bg-[#E9DFD1] p-6 rounded-2xl border border-[#C9A56A]/20 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="sm:hidden font-serif text-xl text-[#C9A56A] font-bold block mb-1">
                    {m.year}
                  </span>
                  {m.location && (
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A56A] font-mono">
                      {m.location}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl text-[#0F1714]">{m.title}</h3>
                <p className="text-xs text-[#2C3A33] mt-2 font-light leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Gallery Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium">
            Inside The Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1714]">
            {data.galleryTitle || 'Workshop & Loom Craft Gallery'}
          </h2>
          {data.gallerySubtitle && (
            <p className="text-xs text-[#8C9A90]">{data.gallerySubtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.gallery || []).map((img, idx) => {
            const imgSrc = img.image || img.url || '';
            return (
              <div
                key={idx}
                onClick={() => imgSrc && setSelectedGalleryImage(imgSrc)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#C9A56A]/30 shadow-lg"
              >
                <img
                  src={imgSrc}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-[#E9DFD1]">
                  {img.category && (
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A56A] font-mono block mb-0.5">
                      {img.category}
                    </span>
                  )}
                <p className="text-[11px] font-medium text-[#E9DFD1] group-hover:text-[#C9A56A] transition-colors">
                    {img.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Lightbox for Gallery */}
        {selectedGalleryImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <img
                src={selectedGalleryImage}
                alt="Workshop View"
                className="w-full max-h-[85vh] object-contain rounded-2xl border border-[#C9A56A]/40"
              />
              <p className="text-center text-xs text-[#C9A56A] mt-3 font-medium tracking-widest uppercase">
                Click anywhere to close preview
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Heritage Numerical Statistics */}
      {data.stats && data.stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {data.stats.map((st, idx) => (
                <div key={idx} className="space-y-2 pt-4 lg:pt-0 px-4">
                  <span className="font-serif text-4xl sm:text-5xl font-bold gold-gradient-text block">
                    {st.value}
                  </span>
                  <strong className="text-xs uppercase tracking-widest text-white font-bold block">
                    {st.label}
                  </strong>
                  <p className="text-[11px] text-[#8C9A90] font-light">
                    {st.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

