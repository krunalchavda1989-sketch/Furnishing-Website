import React, { useState, useEffect } from 'react';
import { HeroCanvas } from '../components/3d/HeroCanvas';
import { AtelierExperienceSection } from '../components/home/AtelierExperienceSection';
import { WhyAtelierSection } from '../components/home/WhyAtelierSection';
import { DesignersArchitectsSection } from '../components/home/DesignersArchitectsSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';
import { CategoryTile } from '../components/ui/CategoryTile';
import { CORE_COLLECTIONS } from '../data/categoriesData';
import { PROJECTS_DATA } from '../data/projectsData';
import { BRANDS_DATA } from '../data/brandsData';
import {
  DEFAULT_TESTIMONIALS,
  DEFAULT_ATELIER_EXPERIENCE,
  DEFAULT_WHY_ATELIER,
  DEFAULT_DESIGNERS_ARCHITECTS,
  DEFAULT_FINAL_CTA,
  DEFAULT_HOME_SECTION_LAYOUT,
  normalizeHomeSectionLayout
} from '../lib/supabase';
import type {
  CategorySlug,
  CategoryInfo,
  Project,
  BrandPartner,
  Testimonial,
  FurnishingScene,
  AtelierExperienceSettings,
  WhyAtelierSettings,
  DesignersArchitectsSettings,
  FinalCtaSettings,
  HomeSectionId,
  HomeSectionLayoutSettings
} from '../types';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight, Quote, MapPin } from 'lucide-react';

interface HomePageProps {
  projects?: Project[];
  brands?: BrandPartner[];
  testimonials?: Testimonial[];
  heroSlides?: FurnishingScene[];
  collections?: CategoryInfo[];
  experience?: AtelierExperienceSettings;
  whyAtelier?: WhyAtelierSettings;
  designersArchitects?: DesignersArchitectsSettings;
  finalCta?: FinalCtaSettings;
  sectionLayout?: HomeSectionLayoutSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onOpenProject: (project: Project) => void;
  onRequestSwatches?: () => void;
}

const FULL_BLEED_SECTIONS = new Set<HomeSectionId>([
  'brand-story',
  'atelier-experience',
  'why-atelier',
  'designers-architects',
  'brands-marquee'
]);

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  brands,
  testimonials,
  heroSlides,
  collections,
  experience = DEFAULT_ATELIER_EXPERIENCE,
  whyAtelier = DEFAULT_WHY_ATELIER,
  designersArchitects = DEFAULT_DESIGNERS_ARCHITECTS,
  finalCta = DEFAULT_FINAL_CTA,
  sectionLayout = DEFAULT_HOME_SECTION_LAYOUT,
  onNavigate,
  onOpenProject,
  onRequestSwatches: _onRequestSwatches
}) => {
  const featuredProjects = (projects && projects.length > 0 ? projects : PROJECTS_DATA).slice(0, 3);
  const activeBrands = (brands && brands.length > 0 ? brands.filter((b) => b.isVisible !== false) : BRANDS_DATA);
  const activeTestimonials = (testimonials && testimonials.length > 0 ? testimonials.filter((t) => t.isVisible !== false) : DEFAULT_TESTIMONIALS);
  const activeCollections = (collections && collections.length > 0 ? collections.filter((c) => c.isVisible !== false) : CORE_COLLECTIONS);

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

  const isSectionRenderable = (id: HomeSectionId): boolean => {
    switch (id) {
      case 'atelier-experience':
        if (experience.isVisible === false) return false;
        return Boolean(
          experience.badge?.trim() ||
            experience.headingPrimary?.trim() ||
            experience.headingAccent?.trim() ||
            experience.introText?.trim() ||
            (experience.steps || []).some((s) => s.isVisible !== false)
        );
      case 'why-atelier':
        if (whyAtelier.isVisible === false) return false;
        return Boolean(
          whyAtelier.badge?.trim() ||
            whyAtelier.headingPrimary?.trim() ||
            whyAtelier.headingAccent?.trim() ||
            (whyAtelier.pillars || []).some((p) => p.isVisible !== false)
        );
      case 'designers-architects':
        if (designersArchitects.isVisible === false) return false;
        return Boolean(
          designersArchitects.badge?.trim() ||
            designersArchitects.headingPrimary?.trim() ||
            designersArchitects.headingAccent?.trim() ||
            (designersArchitects.paragraphs || []).some((p) => p.trim().length > 0)
        );
      case 'final-cta':
        if (finalCta.isVisible === false) return false;
        return Boolean(
          finalCta.badge?.trim() ||
            finalCta.headingPrimary?.trim() ||
            finalCta.headingAccent?.trim() ||
            finalCta.description?.trim()
        );
      case 'testimonials':
        return Boolean(currentReview);
      default:
        return true;
    }
  };

  const orderedSections = normalizeHomeSectionLayout(sectionLayout).sections.filter(
    (item) => item.isVisible !== false && isSectionRenderable(item.id)
  );

  const lastSectionIsFullBleed =
    orderedSections.length > 0 &&
    FULL_BLEED_SECTIONS.has(orderedSections[orderedSections.length - 1].id);

  const renderSectionById = (id: HomeSectionId, isFirst: boolean): React.ReactNode => {
    switch (id) {
      case 'hero':
        return (
          <section
            className={`relative ${isFirst ? 'pt-28 sm:pt-36' : 'pt-2'} px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#C9A56A]/40 bg-[#C9A56A]/10 text-xs text-[#C9A56A] uppercase tracking-widest font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ATELIER LIVING</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] leading-[1.15] font-normal">
                  Beautiful Spaces. <span className="italic font-subserif gold-gradient-text block sm:inline">Thoughtfully Furnished.</span>
                </h1>

                <p className="text-sm sm:text-base font-semibold text-[#0F1714] tracking-wide">
                  Bespoke Furnishings <span className="text-[#C9A56A] font-light mx-1">|</span> Timeless Elegance <span className="text-[#C9A56A] font-light mx-1">|</span> Exceptional Comfort
                </p>

                <div className="space-y-3 text-sm sm:text-base text-[#2C3A33] font-light leading-relaxed max-w-lg">
                  <p>
                    Transform your interiors with thoughtfully curated fabrics, beautifully tailored drapes, custom upholstery, luxurious wallpapers, rugs and mattresses.
                  </p>
                  <p>
                    At Atelier Living, we believe every space deserves to be as unique as the people who live in it.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('curated-collections');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigate('category', 'fabrics');
                      }
                    }}
                    className="px-8 py-4 rounded-full bg-[#0F1714] text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl group cursor-pointer"
                  >
                    <span>Explore Our Collections</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  </button>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-8 py-4 rounded-full border border-[#C9A56A] text-[#0F1714] hover:bg-[#C9A56A]/15 transition-all text-xs font-semibold uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Book a Consultation</span>
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
        );

      case 'brand-story':
        return (
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
                    Our Philosophy
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white">Thoughtfully Composed Interiors</h3>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
                  ABOUT ATELIER LIVING
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                  Where Every Detail <br />
                  <span className="italic font-subserif gold-gradient-text">Makes a Difference.</span>
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-[#D4DDD8] font-light leading-relaxed">
                  <p>
                    Atelier Living is a destination for bespoke furnishings, bringing together craftsmanship, comfort and contemporary elegance.
                  </p>
                  <p>
                    Based in Ahmedabad, we offer a complete range of interior furnishing solutions—from custom-made drapes and upholstery to thoughtfully curated wallpapers, rugs, fabrics and mattresses.
                  </p>
                  <p>
                    Whether you are furnishing a new home, refreshing a favourite space or creating a distinctive commercial interior, we help bring your vision to life through personalised selections and attention to detail.
                  </p>
                </div>

                <div className="p-4 rounded-xl border-l-2 border-[#C9A56A] bg-[#C9A56A]/10 text-sm">
                  <strong className="text-[#C9A56A] font-semibold">Our Philosophy:</strong>{' '}
                  <span className="italic text-white font-serif">
                    Beautiful interiors are not simply decorated. They are thoughtfully composed.
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('story')}
                  className="px-8 py-3.5 rounded-full border border-[#C9A56A] text-[#C9A56A] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center space-x-2 cursor-pointer group"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        );

      case 'collections':
        return (
          <section id="curated-collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1">
                  OUR COLLECTIONS
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#0F1714] font-normal">
                  Everything Your Space Deserves
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#8C9A90] max-w-md font-light leading-relaxed">
                Thoughtfully composed furnishings crafted to bring comfort, sophistication and personality to every room.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activeCollections.map((cat) => (
                <CategoryTile
                  key={cat.id}
                  category={cat}
                  onClick={(catId) => onNavigate('category', catId)}
                />
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center">
              <button
                onClick={() => onNavigate('category', 'drapes-curtains')}
                className="px-10 py-4 rounded-full bg-[#0F1714] text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center space-x-3 shadow-xl group cursor-pointer border border-[#C9A56A]/40"
              >
                <span>View All Collections</span>
                <ArrowRight className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </section>
        );

      case 'atelier-experience':
        return <AtelierExperienceSection experience={experience} onNavigate={onNavigate} />;

      case 'why-atelier':
        return <WhyAtelierSection whyData={whyAtelier} onNavigate={onNavigate} />;

      case 'designers-architects':
        return <DesignersArchitectsSection data={designersArchitects} onNavigate={onNavigate} />;

      case 'final-cta':
        return <FinalCtaSection data={finalCta} onNavigate={onNavigate} />;

      case 'featured-projects':
        return (
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
        );

      case 'brands-marquee':
        return (
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
        );

      case 'testimonials':
        return currentReview ? (
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
        ) : null;
    }
  };

  return (
    <div className={lastSectionIsFullBleed ? 'pb-0' : 'pb-24'}>
      {orderedSections.map((item, idx) => {
        const isFirst = idx === 0;
        let wrapperClass = '';
        if (isFirst) {
          wrapperClass = item.id === 'hero' ? '' : 'pt-24 sm:pt-28';
        } else {
          const prevId = orderedSections[idx - 1].id;
          const bothFullBleed =
            FULL_BLEED_SECTIONS.has(prevId) && FULL_BLEED_SECTIONS.has(item.id);
          wrapperClass = bothFullBleed ? '' : 'mt-20 sm:mt-24';
        }
        return (
          <div key={item.id} className={wrapperClass}>
            {renderSectionById(item.id, isFirst)}
          </div>
        );
      })}
    </div>
  );
};

