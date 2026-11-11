import React from 'react';
import type { CategorySlug, FinalCtaSettings } from '../../types';
import { DEFAULT_FINAL_CTA } from '../../lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaSectionProps {
  data?: FinalCtaSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
}

/**
 * Luminous Champagne-Ivory salon invitation centerpiece rendering the Homepage Final Call To Action.
 */
export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  data = DEFAULT_FINAL_CTA,
  onNavigate
}) => {
  if (data.isVisible === false) {
    return null;
  }

  const hasContent = Boolean(
    data.badge?.trim() ||
      data.headingPrimary?.trim() ||
      data.headingAccent?.trim() ||
      data.description?.trim()
  );

  if (!hasContent) {
    return null;
  }

  return (
    <section
      id="final-call-to-action"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="relative rounded-[2rem] bg-gradient-to-br from-[#F5EFE6] via-[#FDFBF7] to-[#EAE0D0] border border-[#C9A56A]/45 p-8 sm:p-14 lg:p-20 shadow-2xl overflow-hidden text-center">
        {/* Optional soft-opacity architectural background photography */}
        {data.backgroundImage && (
          <img
            src={data.backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none"
          />
        )}

        {/* Concentric Inner Hairline Metallic Frame */}
        <div
          aria-hidden="true"
          className="absolute inset-3 sm:inset-5 rounded-[1.5rem] border border-[#C9A56A]/25 pointer-events-none"
        />

        {/* Subtle Top/Bottom Corner Ambient Glows */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-48 bg-[#C9A56A]/[0.12] rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-7">
          {data.badge && (
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-[#C9A56A]/45 bg-[#C9A56A]/10 text-[11px] uppercase tracking-[0.28em] text-[#C9A56A] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.badge}</span>
            </div>
          )}

          {(data.headingPrimary || data.headingAccent) && (
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] text-[#0F1714] font-normal leading-[1.12]">
              {data.headingPrimary}
              {data.headingAccent && (
                <>
                  {' '}
                  <span className="italic font-subserif gold-gradient-text block sm:inline">
                    {data.headingAccent}
                  </span>
                </>
              )}
            </h2>
          )}

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A56A] to-transparent mx-auto" />

          {data.description && (
            <p className="text-base sm:text-lg text-[#2C3A33] font-light leading-relaxed max-w-2xl mx-auto">
              {data.description}
            </p>
          )}

          {data.ctaLabel && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-9 py-4 rounded-full bg-[#0F1714] text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center space-x-3 shadow-2xl group cursor-pointer border border-[#C9A56A]/45"
              >
                <span>{data.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

