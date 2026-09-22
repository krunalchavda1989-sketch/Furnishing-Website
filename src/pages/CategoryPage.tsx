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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#8C9A90] hover:text-[#C9A56A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => onNavigate('projects')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#C9A56A] hover:underline transition-colors cursor-pointer"
        >
          <span>View Projects Portfolio &rarr;</span>
        </button>
      </div>

      {/* Hero Category Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C9A56A]/30 min-h-[380px] sm:min-h-[460px] flex items-end p-8 sm:p-12">
          <img
            src={categoryInfo.heroImage}
            alt={categoryInfo.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-[#0F1714]/50 to-transparent"></div>

          <div className="relative z-10 max-w-3xl space-y-4 text-[#E9DFD1]">
            <div className="flex items-center space-x-3">
              <span className="glass-panel-dark px-3 py-1 rounded-full text-xs uppercase tracking-widest text-[#C9A56A] border border-[#C9A56A]/40 font-medium">
                {categoryInfo.craftOrigin}
              </span>
              <span className="text-xs text-[#8C9A90] font-light hidden sm:inline">
                {categoryInfo.materialHighlight}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#E9DFD1] font-normal leading-tight">
              {categoryInfo.title}
            </h1>

            <p className="text-sm sm:text-base text-[#8C9A90] font-light leading-relaxed font-subserif text-lg sm:text-xl">
              {categoryInfo.description}
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onRequestSwatches}
                className="px-6 py-3 rounded-full bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-widest hover:bg-[#E6C894] transition-all flex items-center space-x-2 cursor-pointer"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#8C9A90]/40 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block">
              Archive Catalog
            </span>
            <h2 className="font-serif text-3xl text-[#0F1714]">
              {categoryInfo.title} Catalog ({categoryProducts.length} Items)
            </h2>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#C9A56A]" />
            <span className="text-xs uppercase tracking-widest text-[#0F1714] font-bold">Tier:</span>
            {['All', 'Luxury', 'Bespoke', 'Haute Couture'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterPrice(tier)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterPrice === tier
                    ? 'bg-[#0F1714] text-[#C9A56A]'
                    : 'bg-[#DFD5C5] text-[#2C3A33] hover:bg-[#8C9A90]/30'
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
              className="bg-[#E9DFD1] rounded-3xl overflow-hidden border border-[#C9A56A]/20 shadow-xl flex flex-col justify-between hover:border-[#C9A56A] transition-all"
            >
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#C9A56A]">
                  {prod.priceCategory}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1">
                    Origin: {prod.origin}
                  </span>
                  <h3 className="font-serif text-2xl text-[#0F1714]">{prod.name}</h3>
                </div>

                <p className="text-xs text-[#2C3A33] font-light leading-relaxed">
                  {prod.shortDescription}
                </p>

                {/* Specs Box */}
                <div className="bg-[#DFD5C5] p-4 rounded-xl space-y-1.5 text-[11px] text-[#0F1714]">
                  <div className="flex justify-between">
                    <span className="text-[#506155]">Composition:</span>
                    <strong className="font-medium text-right">{prod.materialComposition}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#506155]">Dimensions:</span>
                    <strong className="font-medium">{prod.widthOrDimensions}</strong>
                  </div>
                  {prod.martindaleOrDurability && (
                    <div className="flex justify-between">
                      <span className="text-[#506155]">Durability:</span>
                      <strong className="font-medium">{prod.martindaleOrDurability}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={onRequestSwatches}
                    className="w-full py-2.5 rounded-full bg-[#0F1714] text-[#E9DFD1] text-xs font-bold uppercase tracking-widest hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all flex items-center justify-center space-x-2 cursor-pointer"
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
