import React, { useState } from 'react';
import { BRANDS_DATA } from '../data/brandsData';
import type { BrandPartner } from '../types';
import { X, ExternalLink, Globe } from 'lucide-react';

interface BrandsPageProps {
  brands?: BrandPartner[];
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ brands }) => {
  const [selectedBrand, setSelectedBrand] = useState<BrandPartner | null>(null);
  const activeBrands = (brands && brands.length > 0 ? brands.filter((b) => b.isVisible !== false) : BRANDS_DATA);

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block">
          Global Textile Heritage
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] font-normal">
          Brands <span className="italic font-subserif gold-gradient-text">With Us</span>
        </h1>
        <p className="text-sm sm:text-base text-[#2C3A33] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          We partner directly with historic European weaving houses, mills, and gilded wallcovering ateliers to offer our clients uninhibited access to the world’s most prestigious textile archives.
        </p>
      </section>

      {/* Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="group cursor-pointer bg-[#E9DFD1] rounded-3xl overflow-hidden border border-[#C9A56A]/20 shadow-xl hover:border-[#C9A56A] transition-all p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase text-[#C9A56A] font-medium">
                    Est. {brand.established}
                  </div>
                  <div className="absolute bottom-4 left-4 text-[#E9DFD1]">
                    <span className="font-serif text-2xl font-bold tracking-widest uppercase block">
                      {brand.logoText}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#C9A56A]">
                      {brand.country}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-[#0F1714] group-hover:text-[#C9A56A] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-[#C9A56A] font-semibold uppercase tracking-wider">
                  {brand.tagline}
                </p>
                <p className="text-xs text-[#2C3A33] font-light leading-relaxed line-clamp-3">
                  {brand.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#DFD5C5] flex items-center justify-between mt-4">
                <span className="text-[11px] text-[#8C9A90]">
                  Specialty: <strong className="text-[#0F1714]">{brand.specialty}</strong>
                </span>
                <span className="text-xs font-bold text-[#C9A56A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect House &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0F1714] border border-[#C9A56A]/40 rounded-3xl p-6 sm:p-8 text-[#E9DFD1] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img src={selectedBrand.image} alt={selectedBrand.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute bottom-4 left-4 text-[#E9DFD1]">
                <h2 className="font-serif text-3xl font-bold uppercase">{selectedBrand.logoText}</h2>
                <p className="text-xs text-[#C9A56A] uppercase tracking-wider">{selectedBrand.country} • Est. {selectedBrand.established}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#C9A56A]">{selectedBrand.tagline}</h3>
              <p className="text-xs sm:text-sm text-[#8C9A90] leading-relaxed font-light font-subserif text-base">
                {selectedBrand.description}
              </p>

              {selectedBrand.featuredProducts && selectedBrand.featuredProducts.length > 0 && (
                <div className="bg-[#163129] p-4 rounded-xl border border-[#C9A56A]/20 space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block">
                    Featured Archive Products Distributed:
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#E9DFD1] space-y-1">
                    {selectedBrand.featuredProducts.map((prod, idx) => (
                      <li key={idx}>{prod}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedBrand.websiteUrl && (
                <div className="pt-2">
                  <a
                    href={selectedBrand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Official Maison Website</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

