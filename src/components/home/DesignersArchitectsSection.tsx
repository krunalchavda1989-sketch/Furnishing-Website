import React from 'react';
import type { CategorySlug, DesignersArchitectsSettings } from '../../types';
import { DEFAULT_DESIGNERS_ARCHITECTS } from '../../lib/supabase';
import { ArrowRight, Compass, Layers } from 'lucide-react';

interface DesignersArchitectsSectionProps {
  data?: DesignersArchitectsSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
}

/**
 * Architectural Trade Collaboration band displayed on the homepage beneath Why Atelier Living.
 */
export const DesignersArchitectsSection: React.FC<DesignersArchitectsSectionProps> = ({
  data = DEFAULT_DESIGNERS_ARCHITECTS,
  onNavigate
}) => {
  if (data.isVisible === false) {
    return null;
  }

  const paragraphs = (data.paragraphs || []).filter((p) => p.trim().length > 0);
  const highlights = (data.highlights || []).filter((h) => h.trim().length > 0);
  const hasContent = Boolean(
    data.badge?.trim() ||
      data.headingPrimary?.trim() ||
      data.headingAccent?.trim() ||
      paragraphs.length > 0
  );

  if (!hasContent) {
    return null;
  }

  return (
    <section
      id="designers-architects"
      className="relative bg-[#0F1714] text-[#E9DFD1] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#C9A56A]/25 overflow-hidden"
    >
      {/* Subtle architectural radial glow & hairline accents */}
      <div className="absolute -top-24 right-0 w-[34rem] h-[34rem] bg-[#C9A56A]/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-0 w-[30rem] h-[30rem] bg-[#163129]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A56A]/45 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Editorial Trade Copy */}
        <div className="lg:col-span-6 space-y-6">
          {data.badge && (
            <div className="inline-flex items-center space-x-3">
              <span className="w-8 h-px bg-[#C9A56A]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#C9A56A] font-semibold">
                {data.badge}
              </span>
            </div>
          )}

          {(data.headingPrimary || data.headingAccent) && (
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-[1.15]">
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

          {paragraphs.length > 0 && (
            <div className="space-y-4 border-l border-[#C9A56A]/40 pl-5 sm:pl-6 py-1">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base text-[#D4DDD8] font-light leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          {highlights.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2.5">
              {highlights.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C9A56A]/30 text-[11px] uppercase tracking-wider text-[#E9DFD1] font-medium inline-flex items-center space-x-1.5"
                >
                  <Compass className="w-3 h-3 text-[#C9A56A]" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {data.ctaLabel && (
            <div className="pt-3">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 rounded-full bg-[#C9A56A] text-[#0F1714] hover:bg-[#E6C894] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center space-x-3 shadow-xl group cursor-pointer"
              >
                <span>{data.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Right Architectural Photography Showcase */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border border-[#C9A56A]/35 shadow-2xl h-[420px] sm:h-[500px] group bg-[#163129]">
            <img
              src={
                data.heroImage ||
                DEFAULT_DESIGNERS_ARCHITECTS.heroImage
              }
              alt={data.headingPrimary || 'For Designers and Architects'}
              className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-[#0F1714]/25 to-transparent" />

            {/* Corner Architectural Ornament */}
            <div className="absolute inset-4 rounded-2xl border border-[#C9A56A]/20 pointer-events-none" />

            {/* Top Trade Eyebrow Pill */}
            <div className="absolute top-6 left-6 glass-panel-dark px-3.5 py-1.5 rounded-full border border-[#C9A56A]/40 inline-flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-[#C9A56A]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A56A] font-bold">
                Architect &amp; Trade Program
              </span>
            </div>

            {/* Bottom Frosted Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-5 sm:p-6 glass-panel-dark rounded-2xl border border-[#C9A56A]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#C9A56A] font-semibold block mb-1">
                  Atelier Trade Desk
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  {data.imageCaption || 'Residential & Commercial Trade Collaborations'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="shrink-0 text-xs uppercase tracking-widest font-semibold text-[#C9A56A] hover:underline inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

