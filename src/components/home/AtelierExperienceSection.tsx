import React from 'react';
import type { AtelierExperienceSettings, CategorySlug } from '../../types';
import { DEFAULT_ATELIER_EXPERIENCE } from '../../lib/supabase';
import { ArrowRight, Compass, Layers, SlidersHorizontal, Sparkles } from 'lucide-react';

interface AtelierExperienceSectionProps {
  experience?: AtelierExperienceSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
}

const STAGE_ICONS = [Compass, Sparkles, SlidersHorizontal, Layers];

/**
 * Editorial dark-emerald architecture band presenting Atelier Living's 4-stage bespoke process
 * directly beneath Our Collections on the homepage.
 */
export const AtelierExperienceSection: React.FC<AtelierExperienceSectionProps> = ({
  experience = DEFAULT_ATELIER_EXPERIENCE,
  onNavigate
}) => {
  if (experience.isVisible === false) {
    return null;
  }

  const visibleSteps = (experience.steps || []).filter((step) => step.isVisible !== false);
  const hasHeaderContent = Boolean(
    experience.badge?.trim() ||
      experience.headingPrimary?.trim() ||
      experience.headingAccent?.trim() ||
      experience.introText?.trim()
  );

  if (!hasHeaderContent && visibleSteps.length === 0) {
    return null;
  }

  const getGridClassName = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-xl mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <section
      id="atelier-experience"
      className="relative bg-[#0F1714] text-[#E9DFD1] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#C9A56A]/25 overflow-hidden"
    >
      {/* Subtle architectural ambient glow & metallic frame hairlines */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[20rem] bg-[#C9A56A]/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-[28rem] h-[28rem] bg-[#1D4035]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A56A]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A56A]/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-14 sm:space-y-16">
        {/* Editorial Header */}
        {hasHeaderContent && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pb-10 border-b border-white/10">
            <div className="lg:col-span-7 space-y-4">
              {experience.badge && (
                <div className="inline-flex items-center space-x-3">
                  <span className="w-8 h-px bg-[#C9A56A]" />
                  <span className="text-xs uppercase tracking-[0.28em] text-[#C9A56A] font-semibold">
                    {experience.badge}
                  </span>
                </div>
              )}

              {(experience.headingPrimary || experience.headingAccent) && (
                <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] text-white font-normal leading-[1.12]">
                  {experience.headingPrimary}
                  {experience.headingAccent && (
                    <>
                      {' '}
                      <span className="italic font-subserif gold-gradient-text block sm:inline">
                        {experience.headingAccent}
                      </span>
                    </>
                  )}
                </h2>
              )}
            </div>

            {experience.introText && (
              <div className="lg:col-span-5 lg:pb-1">
                <div className="border-l-2 border-[#C9A56A]/60 pl-5 sm:pl-6 py-1 bg-gradient-to-r from-[#C9A56A]/[0.06] to-transparent rounded-r-2xl">
                  <p className="font-subserif italic text-lg sm:text-xl text-[#E9DFD1]/95 font-light leading-relaxed">
                    &ldquo;{experience.introText}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bespoke Connected Process Grid */}
        {visibleSteps.length > 0 && (
          <div className="relative">
            {visibleSteps.length >= 3 && (
              <div
                aria-hidden="true"
                className="hidden lg:block absolute top-11 left-12 right-12 h-px bg-gradient-to-r from-[#C9A56A]/15 via-[#C9A56A]/45 to-[#C9A56A]/15 pointer-events-none"
              />
            )}

            <div className={`grid gap-6 sm:gap-7 ${getGridClassName(visibleSteps.length)}`}>
              {visibleSteps.map((step, idx) => {
                const stepNumber =
                  step.number && step.number.trim()
                    ? step.number.trim()
                    : String(idx + 1).padStart(2, '0');
                const StepIcon = STAGE_ICONS[idx % STAGE_ICONS.length];

                return (
                  <article
                    key={step.id}
                    className="group relative rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-[#163129]/85 via-[#12261F]/90 to-[#0F1714]/95 border border-[#C9A56A]/25 hover:border-[#C9A56A]/75 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Subtle hover aura + large architectural watermark */}
                    <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-[#C9A56A]/[0.04] group-hover:bg-[#C9A56A]/[0.1] blur-2xl transition-colors duration-500 pointer-events-none" />
                    <span
                      aria-hidden="true"
                      className="absolute top-4 right-6 font-serif text-6xl text-[#C9A56A]/[0.07] group-hover:text-[#C9A56A]/[0.15] transition-colors duration-500 leading-none select-none pointer-events-none"
                    >
                      {stepNumber}
                    </span>

                    <div className="relative z-10 space-y-6">
                      {/* Node Badge + Connecting Rule + Craft Icon */}
                      <div className="flex items-center space-x-3">
                        <span className="w-10 h-10 rounded-full bg-[#0F1714] border border-[#C9A56A]/60 text-[#C9A56A] group-hover:bg-[#C9A56A] group-hover:text-[#0F1714] font-serif font-bold text-sm flex items-center justify-center shadow-lg transition-all duration-300 shrink-0">
                          {stepNumber}
                        </span>
                        <span className="flex-1 h-px bg-gradient-to-r from-[#C9A56A]/45 to-transparent" />
                        <span className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 text-[#C9A56A] flex items-center justify-center shrink-0">
                          <StepIcon className="w-4 h-4" />
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-[1.6rem] text-white font-normal leading-snug group-hover:text-[#E6C894] transition-colors">
                          <span className="text-[#C9A56A] font-light mr-1.5">{stepNumber} —</span>
                          <span>{step.title}</span>
                        </h3>
                        <p className="text-sm text-[#B8C4BC] font-light leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Refined Base Progression Hairline */}
                    <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="h-[1.5px] w-10 group-hover:w-20 bg-gradient-to-r from-[#C9A56A] to-[#E6C894] transition-all duration-500 rounded-full" />
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C9A90] group-hover:text-[#C9A56A] font-semibold transition-colors">
                        Stage {stepNumber}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Bespoke Studio Consultation Callout */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-[#A6B5AD]">
            <span className="w-2 h-2 rounded-full bg-[#C9A56A]" />
            <span className="uppercase tracking-[0.2em] font-medium">
              Personalised Selections &bull; Craftsmanship &amp; Attention to Detail
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 rounded-full border border-[#C9A56A] text-[#C9A56A] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center space-x-2.5 shadow-lg group cursor-pointer"
          >
            <span>{experience.ctaLabel || 'Begin Your Private Consultation'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

