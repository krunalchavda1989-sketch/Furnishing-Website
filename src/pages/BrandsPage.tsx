import React, { useState } from 'react';
import { BRANDS_DATA } from '../data/brandsData';
import type { BrandPartner } from '../types';
import { X } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandPartner | null>(null);

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16">
      {/* Page Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
          Global Textile Heritage
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-normal">
          Brands <span className="italic font-subserif gold-gradient-text">With Us</span>
        </h1>
        <p className="text-sm sm:text-base text-[#4A4844] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          We partner directly with historic European weaving houses, mills, and gilded wallcovering ateliers to offer our clients uninhibited access to the world’s most prestigious textile archives.
        </p>
      </section>

      {/* Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRANDS_DATA.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="group cursor-pointer bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-xl hover:border-[#C5A059] transition-all p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase text-[#C5A059] font-medium">
                    Est. {brand.established}
                  </div>
                  <div className="absolute bottom-4 left-4 text-[#FDFBF7]">
                    <span className="font-serif text-2xl font-bold tracking-widest uppercase block">
                      {brand.logoText}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059]">
                      {brand.country}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-[#1A1918] group-hover:text-[#C5A059] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-[#C5A059] font-semibold uppercase tracking-wider">
                  {brand.tagline}
                </p>
                <p className="text-xs text-[#4A4844] font-light leading-relaxed line-clamp-3">
                  {brand.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#D8C8B8] flex items-center justify-between mt-4">
                <span className="text-[11px] text-[#8C7A6B]">
                  Specialty: <strong className="text-[#1A1918]">{brand.specialty}</strong>
                </span>
                <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
          <div className="relative w-full max-w-2xl bg-[#1A1918] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 text-[#FDFBF7] shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#1A1918] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img src={selectedBrand.image} alt={selectedBrand.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute bottom-4 left-4 text-[#FDFBF7]">
                <h2 className="font-serif text-3xl font-bold uppercase">{selectedBrand.logoText}</h2>
                <p className="text-xs text-[#C5A059] uppercase tracking-wider">{selectedBrand.country} • Est. {selectedBrand.established}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[#C5A059]">{selectedBrand.tagline}</h3>
              <p className="text-xs sm:text-sm text-[#D8C8B8] leading-relaxed font-light font-subserif text-base">
                {selectedBrand.description}
              </p>

              <div className="bg-[#242220] p-4 rounded-xl border border-[#C5A059]/20 space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
                  Featured Archive Products Distributed:
                </span>
                <ul className="list-disc list-inside text-xs text-[#EBE5D8] space-y-1">
                  {selectedBrand.featuredProducts.map((prod, idx) => (
                    <li key={idx}>{prod}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
