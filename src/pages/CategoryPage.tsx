import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { PRODUCTS_DATA } from '../data/productsData';
import type { CategorySlug } from '../types';
import { PackageCheck, ArrowLeft, Filter } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: CategorySlug;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onRequestSwatches: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onNavigate,
  onRequestSwatches
}) => {
  const categoryInfo = CATEGORIES_DATA[categorySlug] || CATEGORIES_DATA['fabrics'];
  const categoryProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === categorySlug);

  const [filterPrice, setFilterPrice] = useState<string>('All');

  const filteredProducts =
    filterPrice === 'All'
      ? categoryProducts
      : categoryProducts.filter((p) => p.priceCategory === filterPrice);

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16">
      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('projects')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#8C7A6B] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories & Projects</span>
        </button>
      </div>

      {/* Hero Category Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/30 min-h-[380px] sm:min-h-[460px] flex items-end p-8 sm:p-12">
          <img
            src={categoryInfo.heroImage}
            alt={categoryInfo.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/50 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-4 text-[#FDFBF7]">
            <div className="flex items-center space-x-3">
              <span className="glass-panel-dark px-3 py-1 rounded-full text-xs uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/40 font-medium">
                {categoryInfo.craftOrigin}
              </span>
              <span className="text-xs text-[#D8C8B8] font-light hidden sm:inline">
                {categoryInfo.materialHighlight}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#FDFBF7] font-normal leading-tight">
              {categoryInfo.title}
            </h1>

            <p className="text-sm sm:text-base text-[#D8C8B8] font-light leading-relaxed font-subserif text-lg sm:text-xl">
              {categoryInfo.description}
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onRequestSwatches}
                className="px-6 py-3 rounded-full bg-[#C5A059] text-[#1A1918] text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center space-x-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Request Category Swatch Box</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Product Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D8C8B8] gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
              Archive Catalog
            </span>
            <h2 className="font-serif text-3xl text-[#1A1918]">
              {categoryInfo.title} Catalog ({categoryProducts.length} Items)
            </h2>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs uppercase tracking-widest text-[#1A1918] font-bold">Tier:</span>
            {['All', 'Luxury', 'Bespoke', 'Haute Couture'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterPrice(tier)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filterPrice === tier
                    ? 'bg-[#1A1918] text-[#C5A059]'
                    : 'bg-[#F5EFE6] text-[#4A4844] hover:bg-[#D8C8B8]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#F5EFE6] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-xl flex flex-col justify-between hover:border-[#C5A059] transition-all"
            >
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#C5A059]">
                  {prod.priceCategory}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold block mb-1">
                    Origin: {prod.origin}
                  </span>
                  <h3 className="font-serif text-2xl text-[#1A1918]">{prod.name}</h3>
                </div>

                <p className="text-xs text-[#4A4844] font-light leading-relaxed">
                  {prod.shortDescription}
                </p>

                {/* Specs Box */}
                <div className="bg-[#EBE5D8] p-4 rounded-xl space-y-1.5 text-[11px] text-[#1A1918]">
                  <div className="flex justify-between">
                    <span className="text-[#8C7A6B]">Composition:</span>
                    <strong className="font-medium text-right">{prod.materialComposition}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7A6B]">Dimensions:</span>
                    <strong className="font-medium">{prod.widthOrDimensions}</strong>
                  </div>
                  {prod.martindaleOrDurability && (
                    <div className="flex justify-between">
                      <span className="text-[#8C7A6B]">Durability:</span>
                      <strong className="font-medium">{prod.martindaleOrDurability}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={onRequestSwatches}
                    className="w-full py-2.5 rounded-full bg-[#1A1918] text-[#FDFBF7] text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1918] transition-all flex items-center justify-center space-x-2"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Order Swatch Sample</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
