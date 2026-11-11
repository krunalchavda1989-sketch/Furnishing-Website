import React, { useEffect, useRef, useState } from 'react';
import type { CategorySlug, WhyAtelierSettings } from '../../types';
import { DEFAULT_WHY_ATELIER } from '../../lib/supabase';
import { ArrowRight, Compass, Layers, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';

interface WhyAtelierSectionProps {
  whyData?: WhyAtelierSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
}

const PILLAR_ICONS = [Compass, Layers, SlidersHorizontal, ShieldCheck, Sparkles];

/**
 * Scroll-driven scrollytelling split layout for "WHY ATELIER LIVING — The Art of Thoughtful Furnishing".
 * Pairs a pinned parallax/crossfading showcase image viewport on desktop with scrollable narrative cards.
 */
export const WhyAtelierSection: React.FC<WhyAtelierSectionProps> = ({
  whyData = DEFAULT_WHY_ATELIER,
  onNavigate
}) => {
  const visiblePillars = (whyData.pillars || []).filter((p) => p.isVisible !== false);
  const hasHeader = Boolean(
    whyData.badge?.trim() || whyData.headingPrimary?.trim() || whyData.headingAccent?.trim()
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  // Keep activeIndex valid if pillars are added/deleted dynamically in Admin
  useEffect(() => {
    if (visiblePillars.length > 0 && activeIndex >= visiblePillars.length) {
      setActiveIndex(0);
    }
  }, [visiblePillars.length, activeIndex]);

  // Synchronize pinned left image and gentle scroll parallax while scrolling (works smoothly with Lenis)
  useEffect(() => {
    if (whyData.isVisible === false || visiblePillars.length === 0) return;

    let rafId: number | null = null;

    const updateOnScroll = () => {
      rafId = null;
      const focusY = window.innerHeight * 0.44;
      let closestIdx = 0;
      let closestDist = Infinity;

      cardRefs.current.forEach((el, idx) => {
        if (!el || idx >= visiblePillars.length) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - focusY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);

      // Compute subtle parallax drift inside the sticky image container (-17px .. +17px)
      if (sectionRef.current) {
        const secRect = sectionRef.current.getBoundingClientRect();
        const scrollable = Math.max(secRect.height - window.innerHeight, 1);
        const progress = Math.min(Math.max(-secRect.top / scrollable, 0), 1);
        setParallaxY((progress - 0.5) * 34);
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateOnScroll);
      }
    };

    updateOnScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [whyData.isVisible, visiblePillars.length]);

  if (whyData.isVisible === false || (!hasHeader && visiblePillars.length === 0)) {
    return null;
  }

  const activePillar = visiblePillars[activeIndex] || visiblePillars[0];
  const progressPct =
    visiblePillars.length > 0 ? ((activeIndex + 1) / visiblePillars.length) * 100 : 100;

  const handleSelectPillar = (idx: number) => {
    setActiveIndex(idx);
    const target = cardRefs.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="why-atelier-living"
      className="relative bg-gradient-to-b from-[#F5EFE6]/70 via-[#FDFBF7] to-[#F5EFE6]/50 text-[#0F1714] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#C9A56A]/20 overflow-x-clip"
    >
      {/* Subtle Light Architectural Glows */}
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Top Editorial Header */}
        {hasHeader && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#8C9A90]/35">
            <div className="space-y-3">
              {whyData.badge && (
                <div className="inline-flex items-center space-x-3">
                  <span className="w-8 h-px bg-[#C9A56A]" />
                  <span className="text-xs uppercase tracking-[0.28em] text-[#C9A56A] font-semibold">
                    {whyData.badge}
                  </span>
                </div>
              )}

              {(whyData.headingPrimary || whyData.headingAccent) && (
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] text-[#0F1714] font-normal leading-[1.12]">
                  {whyData.headingPrimary}
                  {whyData.headingAccent && (
                    <>
                      {' '}
                      <span className="italic font-subserif gold-gradient-text block sm:inline">
                        {whyData.headingAccent}
                      </span>
                    </>
                  )}
                </h2>
              )}
            </div>

            {visiblePillars.length > 0 && (
              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#8C9A90] font-semibold">
                  Scroll to Explore Pillars
                </span>
                <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-[#0F1714] text-[#E9DFD1] border border-[#C9A56A]/40 shadow-md">
                  <span className="font-serif text-sm text-[#C9A56A] font-bold">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/30">/</span>
                  <span className="font-serif text-xs text-[#8C9A90]">
                    {String(visiblePillars.length).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-medium text-white border-l border-white/15 pl-3 truncate max-w-[190px]">
                    {activePillar?.title}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sticky Scrollytelling 2-Column Split Grid */}
        {visiblePillars.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT COLUMN: Sticky Image Showcase with Crossfade & Scroll Parallax (Desktop lg+) */}
            <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-28">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C9A56A]/35 bg-[#0F1714] h-[580px] select-none">
                {/* Cross-fading layered images with smooth vertical scroll parallax */}
                {visiblePillars.map((pillar, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={pillar.id}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        style={{
                          transform: `translate3d(0, ${parallaxY}px, 0) scale(${isActive ? 1.07 : 1.12})`,
                          transition: 'opacity 700ms ease, transform 500ms ease-out'
                        }}
                        className="w-full h-full object-cover filter brightness-[0.86]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-[#0F1714]/35 to-black/20" />
                    </div>
                  );
                })}

                {/* Top Floating Pillar Counter Pill */}
                <div className="relative z-20 p-6 flex items-center justify-between">
                  <div className="glass-panel-dark px-3.5 py-1.5 rounded-full inline-flex items-center space-x-2 border border-[#C9A56A]/40">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A56A]" />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A56A] font-bold">
                      {activePillar?.imageCaption || activePillar?.title}
                    </span>
                  </div>

                  <span className="w-10 h-10 rounded-full glass-panel-dark border border-[#C9A56A]/50 text-[#C9A56A] font-serif font-bold text-sm flex items-center justify-center shadow-lg">
                    {activePillar?.number || String(activeIndex + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom Glass Editorial Caption Card & Progress Rail */}
                {activePillar && (
                  <div className="absolute bottom-6 left-6 right-6 z-20 glass-panel-dark rounded-2xl p-6 border border-[#C9A56A]/35 shadow-2xl space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                        {activePillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#D4DDD8] font-light leading-relaxed">
                        {activePillar.description}
                      </p>
                    </div>

                    {/* Interactive Progress Track + Clickable Indicators */}
                    <div className="pt-2 space-y-3">
                      <div className="w-full h-[2px] bg-white/15 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPct}%` }}
                          className="h-full bg-gradient-to-r from-[#C9A56A] to-[#E6C894] transition-all duration-500 rounded-full"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {visiblePillars.map((p, i) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectPillar(i)}
                              aria-label={`Jump to ${p.title}`}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                i === activeIndex
                                  ? 'w-8 bg-[#C9A56A]'
                                  : 'w-2 bg-white/30 hover:bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A56A] font-semibold">
                          Click indicator or scroll
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Scrolling Pillar Cards */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-7 relative">
              {visiblePillars.map((pillar, idx) => {
                const isActive = idx === activeIndex;
                const displayNum =
                  pillar.number && pillar.number.trim()
                    ? pillar.number.trim()
                    : String(idx + 1).padStart(2, '0');
                const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];

                return (
                  <article
                    key={pillar.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    onClick={() => handleSelectPillar(idx)}
                    className={`rounded-3xl p-6 sm:p-8 border transition-all duration-500 cursor-pointer relative overflow-hidden ${
                      isActive
                        ? 'bg-[#0F1714] text-[#E9DFD1] border-[#C9A56A]/75 shadow-2xl lg:-translate-x-2'
                        : 'bg-white/80 hover:bg-white text-[#0F1714] border-[#C9A56A]/25 hover:border-[#C9A56A]/65 shadow-sm hover:shadow-lg opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Mobile / Tablet Inline Visual Frame (< lg viewports) */}
                    <div className="lg:hidden relative h-52 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-[#C9A56A]/30">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714]/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#0F1714]/90 border border-[#C9A56A]/60 text-[#C9A56A] font-serif font-bold text-xs flex items-center justify-center">
                        {displayNum}
                      </span>
                      {pillar.imageCaption && (
                        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-[#E9DFD1] font-semibold glass-panel-dark px-3 py-1 rounded-full border border-[#C9A56A]/30">
                          {pillar.imageCaption}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`hidden lg:flex w-9 h-9 rounded-full font-serif font-bold text-xs items-center justify-center border transition-all ${
                              isActive
                                ? 'bg-[#C9A56A] text-[#0F1714] border-[#C9A56A]'
                                : 'bg-[#F5EFE6] text-[#0F1714] border-[#C9A56A]/40'
                            }`}
                          >
                            {displayNum}
                          </span>
                          <span
                            className={`h-px flex-1 max-w-[3rem] transition-colors ${
                              isActive ? 'bg-[#C9A56A]' : 'bg-[#C9A56A]/40'
                            }`}
                          />
                          {pillar.imageCaption && (
                            <span
                              className={`text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors ${
                                isActive ? 'text-[#C9A56A]' : 'text-[#8C9A90]'
                              }`}
                            >
                              {pillar.imageCaption}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-serif text-2xl sm:text-[1.7rem] font-normal leading-snug transition-colors ${
                            isActive ? 'text-white' : 'text-[#0F1714]'
                          }`}
                        >
                          {pillar.title}
                        </h3>

                        <p
                          className={`text-sm font-light leading-relaxed transition-colors ${
                            isActive ? 'text-[#D4DDD8]' : 'text-[#2C3A33]'
                          }`}
                        >
                          {pillar.description}
                        </p>
                      </div>

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isActive
                            ? 'bg-[#C9A56A]/15 border-[#C9A56A]/40 text-[#C9A56A]'
                            : 'bg-[#F5EFE6] border-[#C9A56A]/25 text-[#8C9A90]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Subtle Gold Hairline Footer */}
                    <div
                      className={`mt-5 pt-3 border-t flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-semibold ${
                        isActive
                          ? 'border-white/10 text-[#C9A56A]'
                          : 'border-[#8C9A90]/20 text-[#8C9A90]'
                      }`}
                    >
                      <span>{isActive ? 'Featured in Viewport' : `Pillar ${displayNum}`}</span>
                      <span
                        className={`h-[1.5px] transition-all duration-500 rounded-full ${
                          isActive
                            ? 'w-16 bg-gradient-to-r from-[#C9A56A] to-[#E6C894]'
                            : 'w-6 bg-[#C9A56A]/35'
                        }`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Studio Consultation Strip */}
        <div className="pt-8 border-t border-[#8C9A90]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-[#2C3A33]">
            <span className="w-2 h-2 rounded-full bg-[#C9A56A]" />
            <span className="uppercase tracking-[0.2em] font-medium">
              Atelier Living &bull; Thoughtful Furnishing Under One Roof
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 rounded-full bg-[#0F1714] text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center space-x-3 shadow-xl group cursor-pointer border border-[#C9A56A]/40"
          >
            <span>{whyData.ctaLabel || 'Schedule a Bespoke Consultation'}</span>
            <ArrowRight className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </section>
  );
};
