import React, { useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug } from '../../types';
import { Menu, X, ChevronDown, PhoneCall, Compass, PackageCheck, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onRequestSwatches: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onRequestSwatches
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const handleCategoryClick = (catId: CategorySlug) => {
    setIsMegaMenuOpen(false);
    setIsMobileDrawerOpen(false);
    onNavigate('category', catId);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'story', label: 'Our Story' },
    { id: 'projects', label: 'Our Projects', hasMegaMenu: true },
    { id: 'brands', label: 'Brands With Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0F1714]/98 backdrop-blur-2xl border-b border-[#C9A56A]/50 py-2 sm:py-2.5 shadow-2xl text-white'
          : 'bg-[#163129]/95 backdrop-blur-xl border-b border-[#C9A56A]/35 py-2.5 sm:py-3.5 shadow-xl text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Compact Brand Logo Header */}
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              onNavigate('home');
            }}
            className="flex items-center space-x-2 sm:space-x-3 group text-left focus:outline-none shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#C9A56A] sm:border-2 flex items-center justify-center bg-[#C9A56A]/20 group-hover:bg-[#C9A56A] group-hover:shadow-[0_0_15px_rgba(201,165,106,0.5)] transition-all duration-300 shadow-md shrink-0">
              <span className="font-serif font-bold text-base sm:text-xl text-[#C9A56A] group-hover:text-[#0F1714] transition-colors">
                M
              </span>
            </div>
            <div className="leading-tight">
              <span className="font-serif tracking-wider sm:tracking-widest text-sm sm:text-xl font-bold uppercase text-white group-hover:text-[#C9A56A] transition-colors block drop-shadow-sm">
                Maison & Drape
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.28em] uppercase text-[#C9A56A] font-semibold">
                Atelier Haute Living
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.id ||
                (link.hasMegaMenu && (activeTab === 'projects' || activeTab === 'category'));

              if (link.hasMegaMenu) {
                return (
                  <div
                    key={link.id}
                    className="relative"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <button
                      onClick={() => onNavigate('projects')}
                      className={`flex items-center space-x-1.5 text-xs xl:text-sm uppercase tracking-widest font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-[#C9A56A] bg-[#C9A56A]/25 border border-[#C9A56A]/50 shadow-inner'
                          : 'text-white/90 hover:text-[#C9A56A] hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isMegaMenuOpen ? 'rotate-180 text-[#C9A56A]' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isMegaMenuOpen && (
                      <div className="absolute top-full -left-48 w-[840px] bg-[#0F1714]/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-[#C9A56A]/40 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="col-span-4 pb-3 mb-2 border-b border-[#C9A56A]/30 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-[#C9A56A]" /> Explore Furnishing Categories
                          </span>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              onNavigate('projects');
                            }}
                            className="text-xs text-white hover:text-[#C9A56A] underline tracking-wider font-medium cursor-pointer"
                          >
                            View All Projects Portfolio &rarr;
                          </button>
                        </div>

                        {Object.values(CATEGORIES_DATA).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                            className="group/card text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#C9A56A]/20 hover:border-[#C9A56A]/50 transition-all flex flex-col justify-between cursor-pointer"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2">
                              <img
                                src={cat.heroImage}
                                alt={cat.title}
                                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/20 transition-colors"></div>
                            </div>
                            <div>
                              <h4 className="font-serif text-sm font-semibold text-white group-hover/card:text-[#C9A56A] transition-colors leading-snug">
                                {cat.title}
                              </h4>
                              <p className="text-[11px] text-[#8C9A90] line-clamp-1 mt-0.5 font-light">
                                {cat.subtitle}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs xl:text-sm uppercase tracking-widest font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#C9A56A] bg-[#C9A56A]/25 border border-[#C9A56A]/50 shadow-inner'
                      : 'text-white/90 hover:text-[#C9A56A] hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={onRequestSwatches}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] hover:brightness-110 font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#C9A56A]/25 hover:shadow-[#C9A56A]/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center space-x-2 border border-[#E9DFD1]/60 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-[#0F1714] stroke-[2.5]" />
              <span>Request Swatches</span>
            </button>
          </div>

          {/* Compact Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onRequestSwatches}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md border border-[#E9DFD1]/50 shrink-0 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Swatches</span>
            </button>

            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-[#C9A56A] bg-white/10 hover:bg-[#C9A56A]/25 border border-[#C9A56A]/40 focus:outline-none transition-all shrink-0 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top-Down Dropdown Menu Overlay */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden">
          {/* Dimmed Backdrop below Header */}
          <div
            className="fixed inset-0 top-[52px] sm:top-[64px] bg-black/75 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Top-Down Dropdown Container - Attached flush under header */}
          <div className="absolute top-full left-0 right-0 max-h-[calc(100vh-60px)] bg-[#0F1714]/98 backdrop-blur-2xl border-b-2 border-[#C9A56A]/50 shadow-2xl overflow-y-auto p-4 sm:p-6 z-50 animate-in slide-in-from-top-2 duration-300 text-white">
            <div className="space-y-3">
              {navLinks.map((link) => {
                const isActive =
                  activeTab === link.id ||
                  (link.hasMegaMenu && (activeTab === 'projects' || activeTab === 'category'));

                if (link.hasMegaMenu) {
                  return (
                    <div key={link.id} className="border-b border-white/10 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsMobileDrawerOpen(false);
                            onNavigate('projects');
                          }}
                          className={`text-base sm:text-lg uppercase tracking-wider font-serif font-bold text-left flex items-center gap-2 ${
                            isActive ? 'text-[#C9A56A]' : 'text-white hover:text-[#C9A56A]'
                          }`}
                        >
                          <span>Our Projects</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A56A]" />
                        </button>

                        <button
                          onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-[#C9A56A]/30 text-xs text-[#C9A56A] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <span>Categories</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ${
                              mobileCategoriesExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Collapsible Category Grid inside Dropdown */}
                      {mobileCategoriesExpanded && (
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-1">
                          {Object.values(CATEGORIES_DATA).map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#C9A56A]/20 hover:border-[#C9A56A]/50 transition-all text-left flex items-center justify-between group cursor-pointer"
                            >
                              <div>
                                <span className="block text-xs font-semibold text-white group-hover:text-[#C9A56A] leading-tight">
                                  {cat.title}
                                </span>
                                <span className="text-[10px] text-[#C9A56A] block font-light line-clamp-1 mt-0.5">
                                  {cat.materialHighlight}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-[#C9A56A] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onNavigate(link.id);
                    }}
                    className={`block w-full text-left text-base sm:text-lg uppercase tracking-wider font-serif font-bold border-b border-white/10 pb-3 transition-colors ${
                      isActive ? 'text-[#C9A56A]' : 'text-white hover:text-[#C9A56A]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions in Dropdown */}
            <div className="pt-4 border-t border-[#C9A56A]/40 space-y-2.5 mt-4">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onRequestSwatches();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#0F1714] stroke-[2.5]" />
                <span>Order Swatch Box</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onNavigate('contact');
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#C9A56A]" />
                <span>Private Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

