import React, { useState, useEffect } from 'react';
import { HeroCanvas } from '../components/3d/HeroCanvas';
import { CategoryTile } from '../components/ui/CategoryTile';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BRANDS_DATA } from '../data/brandsData';
import { DEFAULT_TESTIMONIALS } from '../lib/supabase';
import type { CategorySlug, Project, BrandPartner, Testimonial, FurnishingScene } from '../types';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight, Quote, MapPin } from 'lucide-react';

interface HomePageProps {
  projects?: Project[];
  brands?: BrandPartner[];
  testimonials?: Testimonial[];
  heroSlides?: FurnishingScene[];
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onOpenProject: (project: Project) => void;
  onRequestSwatches: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  brands,
  testimonials,
  heroSlides,
  onNavigate,
  onOpenProject,
  onRequestSwatches
}) => {
  const featuredProjects = (projects && projects.length > 0 ? projects : PROJECTS_DATA).slice(0, 3);
  const activeBrands = (brands && brands.length > 0 ? brands.filter((b) => b.isVisible !== false) : BRANDS_DATA);
  const activeTestimonials = (testimonials && testimonials.length > 0 ? testimonials.filter((t) => t.isVisible !== false) : DEFAULT_TESTIMONIALS);

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Auto cycle testimonials every 7 seconds
  useEffect(() => {
    if (activeTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % activeTestimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeTestimonials.length]);

  const currentReview = activeTestimonials[activeReviewIdx] || activeTestimonials[0];

  const handlePrevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const handleNextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % activeTestimonials.length);
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 sm:pt-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#C9A56A]/40 bg-[#C9A56A]/10 text-xs text-[#C9A56A] uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haute Furnishings &amp; Bespoke Drapes</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] leading-[1.1] font-normal">
              Atmosphere Sculpted in <span className="italic font-subserif gold-gradient-text">Tactile Motion</span>
            </h1>

            <p className="text-sm sm:text-base text-[#2C3A33] font-light leading-relaxed max-w-lg">
              Atelier Living curates rare woven silks, Belgian flax drapes, hand-knotted Himalayan rugs, and bespoke wallcoverings for grand residences, yachts, and private sanctuaries worldwide.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('projects')}
                className="px-8 py-4 rounded-full bg-[#0F1714] text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl group cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
              </button>

              <button
                onClick={onRequestSwatches}
                className="px-8 py-4 rounded-full border border-[#C9A56A] text-[#0F1714] hover:bg-[#C9A56A]/15 transition-all text-xs font-semibold uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Request Swatches</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#8C9A90]/40 text-xs">
              <div>
                <strong className="block font-serif text-xl text-[#0F1714]">1898</strong>
                <span className="text-[#8C9A90] text-[11px] uppercase tracking-wider">Atelier Legacy</span>
              </div>
              <div>
                <strong className="block font-serif text-xl text-[#0F1714]">8</strong>
                <span className="text-[#8C9A90] text-[11px] uppercase tracking-wider">Craft Archives</span>
              </div>
              <div>
                <strong className="block font-serif text-xl text-[#0F1714]">100%</strong>
                <span className="text-[#8C9A90] text-[11px] uppercase tracking-wider">Bespoke Mill Sourcing</span>
              </div>
            </div>
          </div>

          {/* Right Professional Furnishing Showcase */}
          <div className="lg:col-span-7">
            <HeroCanvas slides={heroSlides} />
          </div>
        </div>
      </section>

      {/* --- BRAND STORY TEASER --- */}
      <section className="bg-[#0F1714] text-[#E9DFD1] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[#C9A56A]/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85"
              alt="Atelier Living Craftsmen"
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel-dark rounded-2xl border border-[#C9A56A]/30">
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] block mb-1 font-medium">
                The Heritage Philosophy
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white">Bespoke Architectural Weaving</h3>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
              Centuries of Textile Mastery
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
              Woven for Generations. <br />
              <span className="italic font-subserif gold-gradient-text">Designed to Endure.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8C9A90] font-light leading-relaxed">
              From historic Como silk looms to hand-loomed Belgian flax fields, each material in our repository undergoes rigorous martindale testing, acoustic calibration, and lightfastness grading.
            </p>
            <button
              onClick={() => onNavigate('story')}
              className="px-8 py-3.5 rounded-full border border-[#C9A56A] text-[#C9A56A] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Our Heritage &amp; Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- CATEGORY NAVIGATOR TILES --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0F1714] font-normal">
              Explore Our 8 Product Archives
            </h2>
          </div>
          <p className="text-xs text-[#8C9A90] max-w-md font-light">
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
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block mb-1">
              Curated Residences &amp; Superyachts
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0F1714] font-normal">
              Featured Interior Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-[#0F1714] hover:text-[#C9A56A] transition-colors cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 text-[#C9A56A]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer space-y-4"
            >
              <div className="relative h-[380px] rounded-3xl overflow-hidden border border-[#C9A56A]/20 shadow-xl">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-[#C9A56A]">
                  {project.category}
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-[#E9DFD1]">
                  <span className="text-xs text-[#8C9A90] block">{project.location}</span>
                  <h3 className="font-serif text-xl text-[#E9DFD1] font-normal group-hover:text-[#C9A56A] transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8C9A90] px-1">
                <span>Designed by {project.designer}</span>
                <span className="font-semibold text-[#0F1714] group-hover:text-[#C9A56A] flex items-center gap-1">
                  Inspect Project &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC BRANDS WITH US MARQUEE --- */}
      <section className="bg-[#163129] text-[#E9DFD1] py-16 border-y border-[#C9A56A]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block mb-1">
            Global Partners &amp; Mill Houses
          </span>
          <h3 className="font-serif text-2xl text-[#E9DFD1]">
            Distributing World-Renowned Textile Archives
          </h3>
        </div>

        {/* Marquee Track */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center space-x-16">
            {[...activeBrands, ...activeBrands].map((brand, idx) => (
              <div
                key={`${brand.id}-${idx}`}
                onClick={() => onNavigate('brands')}
                className="shrink-0 cursor-pointer flex flex-col items-center group px-4 transition-transform hover:scale-105"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-[#E9DFD1]/70 group-hover:text-[#C9A56A] transition-colors uppercase">
                  {brand.logoText}
                </span>
                <span className="text-[10px] text-[#8C9A90] uppercase tracking-widest mt-1">
                  {brand.country} &bull; Est. {brand.established}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DYNAMIC INTERACTIVE TESTIMONIAL CAROUSEL --- */}
      {currentReview && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#163129] border border-[#C9A56A]/30 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A56A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Star Rating */}
              <div className="flex items-center justify-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= (currentReview.rating || 5)
                        ? 'text-[#C9A56A] fill-[#C9A56A]'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <div className="relative max-w-3xl mx-auto">
                <Quote className="w-10 h-10 text-[#C9A56A]/20 absolute -top-5 -left-4 sm:-left-8 pointer-events-none" />
                <blockquote className="font-serif text-xl sm:text-3xl text-white italic leading-relaxed font-subserif">
                  &ldquo;{currentReview.quote}&rdquo;
                </blockquote>
              </div>

              {/* Client Profile */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full border border-[#C9A56A] bg-[#C9A56A]/20 overflow-hidden flex items-center justify-center text-[#C9A56A] font-serif font-bold text-base shadow-lg">
                  {currentReview.avatar ? (
                    <img src={currentReview.avatar} alt={currentReview.clientName} className="w-full h-full object-cover" />
                  ) : (
                    currentReview.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>

                <div>
                  <cite className="not-italic text-sm font-bold uppercase tracking-widest text-white block">
                    {currentReview.clientName}
                  </cite>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#8C9A90] mt-0.5">
                    {currentReview.clientRole && <span>{currentReview.clientRole}</span>}
                    {currentReview.location && (
                      <span className="flex items-center gap-1 font-mono text-[#C9A56A]">
                        &bull; <MapPin className="w-3 h-3 inline" /> {currentReview.location}
                      </span>
                    )}
                    {currentReview.projectOrProduct && (
                      <span className="text-[#E9DFD1]/70 font-mono">
                        &bull; {currentReview.projectOrProduct}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Carousel Controls & Dot Indicators */}
              {activeTestimonials.length > 1 && (
                <div className="pt-4 flex items-center justify-center space-x-6">
                  <button
                    type="button"
                    onClick={handlePrevReview}
                    className="p-2.5 rounded-full bg-white/5 hover:bg-[#C9A56A] text-[#C9A56A] hover:text-[#0F1714] border border-[#C9A56A]/30 transition-all cursor-pointer shadow-md"
                    title="Previous Review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {activeTestimonials.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveReviewIdx(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === activeReviewIdx
                            ? 'w-8 bg-[#C9A56A]'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        title={`Review ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextReview}
                    className="p-2.5 rounded-full bg-white/5 hover:bg-[#C9A56A] text-[#C9A56A] hover:text-[#0F1714] border border-[#C9A56A]/30 transition-all cursor-pointer shadow-md"
                    title="Next Review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

