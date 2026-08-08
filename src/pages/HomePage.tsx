import React from 'react';
import { HeroCanvas } from '../components/3d/HeroCanvas';
import { CategoryTile } from '../components/ui/CategoryTile';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BRANDS_DATA } from '../data/brandsData';
import type { CategorySlug, Project } from '../types';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onOpenProject: (project: Project) => void;
  onRequestSwatches: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenProject,
  onRequestSwatches
}) => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 sm:pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-xs text-[#C5A059] uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Furnishings & Bespoke Drapes</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] leading-[1.1] font-normal">
              Atmosphere Sculpted in <span className="italic font-subserif gold-gradient-text">Tactile Motion</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4A4844] font-light leading-relaxed max-w-lg">
              Maison & Drape curates rare woven silks, Belgian flax drapes, hand-knotted Himalayan rugs, and bespoke wallcoverings for grand residences, yachts, and private sanctuaries worldwide.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('projects')}
                className="px-8 py-4 rounded-full bg-[#1A1918] text-[#FDFBF7] hover:bg-[#C5A059] hover:text-[#1A1918] transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl group"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:text-[#1A1918] transition-colors" />
              </button>

              <button
                onClick={onRequestSwatches}
                className="px-8 py-4 rounded-full border border-[#C5A059] text-[#1A1918] hover:bg-[#C5A059]/15 transition-all text-xs font-semibold uppercase tracking-widest flex items-center justify-center space-x-2"
              >
                <span>Request Swatches</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#D8C8B8]/40 text-xs">
              <div>
                <strong className="block font-serif text-xl text-[#1A1918]">1898</strong>
                <span className="text-[#8C7A6B] text-[11px] uppercase tracking-wider">Atelier Legacy</span>
              </div>
              <div>
                <strong className="block font-serif text-xl text-[#1A1918]">8</strong>
                <span className="text-[#8C7A6B] text-[11px] uppercase tracking-wider">Craft Archives</span>
              </div>
              <div>
                <strong className="block font-serif text-xl text-[#1A1918]">100%</strong>
                <span className="text-[#8C7A6B] text-[11px] uppercase tracking-wider">Bespoke Mill Sourcing</span>
              </div>
            </div>
          </div>

          {/* Right Professional Furnishing Showcase */}
          <div className="lg:col-span-7">
            <HeroCanvas />
          </div>
        </div>
      </section>

      {/* --- BRAND STORY TEASER --- */}
      <section className="bg-[#1A1918] text-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[#C5A059]/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85"
              alt="Maison Craftsmen"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel-dark rounded-2xl border border-[#C5A059]/30">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] block mb-1 font-medium">
                The Heritage Philosophy
              </span>
              <p className="text-xs text-[#EBE5D8] italic">
                "True luxury in interior design is not merely visual — it is acoustic, tactile, and light-responsive."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block">
              Atelier Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FDFBF7] font-normal leading-tight">
              Woven from Heritage River Basins & Historic Looms
            </h2>
            <p className="text-sm text-[#D8C8B8] leading-relaxed font-light font-subserif text-lg">
              Every drape, cushion, and carpet in our archives is rooted in historical craftsmanship — from organic flax harvested along the Lys river in Flanders to raw silks spun in the hills of Como and hand-dyed Angora mohair velvets from Florence.
            </p>
            <button
              onClick={() => onNavigate('story')}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#C5A059] hover:text-[#D4AF37] transition-colors"
            >
              <span>Discover Our Heritage Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- CATEGORY NAVIGATOR TILES --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1918] font-normal">
              Explore Our 8 Product Archives
            </h2>
          </div>
          <p className="text-xs text-[#8C7A6B] max-w-md font-light">
            Select any category below to inspect our material compositions, origin stories, and texture archives.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(CATEGORIES_DATA).map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              onClick={(catId) => onNavigate('category', catId)}
            />
          ))}
        </div>
      </section>

      {/* --- FEATURED PROJECTS PORTFOLIO SHOWCASE --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-1">
              Curated Residences & Superyachts
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1A1918] font-normal">
              Featured Interior Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#1A1918] hover:text-[#C5A059] transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROJECTS_DATA.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer space-y-4"
            >
              <div className="relative h-[380px] rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-xl">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#C5A059]">
                  {project.category}
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                  <span className="text-xs text-[#D8C8B8] block">{project.location}</span>
                  <h3 className="font-serif text-xl text-[#FDFBF7] font-normal group-hover:text-[#C5A059] transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8C7A6B] px-1">
                <span>Designed by {project.designer}</span>
                <span className="font-semibold text-[#1A1918] group-hover:text-[#C5A059] flex items-center gap-1">
                  Inspect Project &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BRANDS WITH US MARQUEE --- */}
      <section className="bg-[#F5EFE6] py-16 border-y border-[#C5A059]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-1">
            Global Partners & Mill Houses
          </span>
          <h3 className="font-serif text-2xl text-[#1A1918]">
            Distributing World-Renowned Textile Archives
          </h3>
        </div>

        {/* Marquee Track */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center space-x-16">
            {[...BRANDS_DATA, ...BRANDS_DATA].map((brand, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('brands')}
                className="shrink-0 cursor-pointer flex flex-col items-center group px-4"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#1A1918]/60 group-hover:text-[#C5A059] transition-colors uppercase">
                  {brand.logoText}
                </span>
                <span className="text-[10px] text-[#8C7A6B] uppercase tracking-widest mt-1">
                  {brand.country} • Est. {brand.established}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EDITORIAL TESTIMONIAL QUOTE --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
          <Star className="w-5 h-5 fill-[#C5A059]" />
        </div>
        <blockquote className="font-serif text-2xl sm:text-4xl text-[#1A1918] italic leading-relaxed font-subserif">
          "Working with Maison & Drape on our Belgravia townhouse was transformative. Their acoustic sheer drapes and hand-knotted Himalayan rugs brought an understated quiet luxury that defines our home."
        </blockquote>
        <div>
          <cite className="not-italic text-xs font-bold uppercase tracking-widest text-[#1A1918] block">
            Lady Clarissa Montgomery
          </cite>
          <span className="text-xs text-[#8C7A6B]">Belgravia Residence, London</span>
        </div>
      </section>
    </div>
  );
};
