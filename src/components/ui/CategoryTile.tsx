import React from 'react';
import type { CategoryInfo, CategorySlug } from '../../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryTileProps {
  category: CategoryInfo;
  onClick: (catId: CategorySlug) => void;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick(category.id)}
      className="group relative h-[400px] sm:h-[460px] rounded-3xl overflow-hidden cursor-pointer border border-[#C9A56A]/20 shadow-xl transition-all duration-700 hover:border-[#C9A56A]/80 hover:shadow-2xl flex flex-col justify-between"
    >
      {/* Background High-Res Photography */}
      <img
        src={category.heroImage}
        alt={category.title}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out filter brightness-95 group-hover:brightness-100"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-[#0F1714]/40 to-black/30 group-hover:via-[#0F1714]/25 transition-all duration-500"></div>

      {/* Top Origin Tag & Collection Number */}
      <div className="relative top-0 left-0 right-0 p-5 sm:p-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          {category.number && (
            <span className="w-8 h-8 rounded-full bg-[#C9A56A] text-[#0F1714] font-serif font-bold text-xs flex items-center justify-center shadow-lg">
              {category.number}
            </span>
          )}
          <span className="glass-panel-dark px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-[#C9A56A] border border-[#C9A56A]/30 font-medium">
            {category.craftOrigin}
          </span>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#0F1714]/70 border border-[#C9A56A]/40 flex items-center justify-center text-[#C9A56A] group-hover:bg-[#C9A56A] group-hover:text-[#0F1714] transition-all transform group-hover:rotate-45">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative p-6 sm:p-8 z-10 space-y-2.5">
        <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> {category.materialHighlight}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#E9DFD1] font-normal leading-tight group-hover:text-[#C9A56A] transition-colors">
          {category.number ? `${category.number}. ${category.title}` : category.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-[#A6B5AD] font-light leading-relaxed opacity-95 group-hover:opacity-100 transition-opacity line-clamp-3">
          {category.description}
        </p>

        <div className="pt-2 flex items-center text-xs font-semibold uppercase tracking-widest text-[#C9A56A] group-hover:translate-x-2 transition-transform duration-300">
          <span>Explore Collection</span>
          <span className="ml-2">&rarr;</span>
        </div>
      </div>
    </div>
  );
};
