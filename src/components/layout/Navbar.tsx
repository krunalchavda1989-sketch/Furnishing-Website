import React, { useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug } from '../../types';
import { Menu, X, ChevronDown, PhoneCall, Compass, PackageCheck } from 'lucide-react';

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
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          ? 'bg-[#0D0C0B]/98 backdrop-blur-2xl border-b border-[#C5A059]/50 py-2.5 shadow-2xl text-white'
          : 'bg-[#121110]/95 backdrop-blur-xl border-b border-[#C5A059]/35 py-3.5 shadow-xl text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#C5A059]/20 group-hover:bg-[#C5A059] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-all duration-300 shadow-md">
              <span className="font-serif font-bold text-xl text-[#F5D07F] group-hover:text-[#121110] transition-colors">
                M
              </span>
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg sm:text-xl font-bold uppercase text-white group-hover:text-[#F5D07F] transition-colors block drop-shadow-sm">
                Maison & Drape
              </span>
              <span className="text-[10px] tracking-[0.28em] uppercase text-[#D4AF37] font-semibold block">
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
                      className={`flex items-center space-x-1.5 text-xs xl:text-sm uppercase tracking-widest font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-[#F5D07F] bg-[#C5A059]/25 border border-[#C5A059]/50 shadow-inner'
                          : 'text-white/90 hover:text-[#F5D07F] hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isMegaMenuOpen ? 'rotate-180 text-[#F5D07F]' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isMegaMenuOpen && (
                      <div className="absolute top-full -left-48 w-[840px] bg-[#121110]/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-[#C5A059]/40 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="col-span-4 pb-3 mb-2 border-b border-[#C5A059]/30 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-[#F5D07F] font-bold flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-[#F5D07F]" /> Explore Furnishing Categories
                          </span>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              onNavigate('projects');
                            }}
                            className="text-xs text-white hover:text-[#F5D07F] underline tracking-wider font-medium"
                          >
                            View All Projects Portfolio &rarr;
                          </button>
                        </div>

                        {Object.values(CATEGORIES_DATA).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                            className="group/card text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-[#C5A059]/20 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between"
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
                              <h4 className="font-serif text-sm font-semibold text-white group-hover/card:text-[#F5D07F] transition-colors leading-snug">
                                {cat.title}
                              </h4>
                              <p className="text-[11px] text-[#D8C8B8] line-clamp-1 mt-0.5 font-light">
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
                  className={`text-xs xl:text-sm uppercase tracking-widest font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#F5D07F] bg-[#C5A059]/25 border border-[#C5A059]/50 shadow-inner'
                      : 'text-white/90 hover:text-[#F5D07F] hover:bg-white/10'
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
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#121110] hover:brightness-110 font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#C5A059]/25 hover:shadow-[#C5A059]/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center space-x-2 border border-[#FFF0C2]/60 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-[#121110] stroke-[2.5]" />
              <span>Request Swatches</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={onRequestSwatches}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E2C37E] text-[#121110] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md border border-[#FFF0C2]/50"
            >
              <PackageCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Swatches</span>
            </button>

            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="p-2 rounded-lg text-white bg-white/10 hover:bg-[#C5A059]/20 hover:text-[#F5D07F] border border-white/15 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 top-[70px] z-40 bg-[#121110]/98 backdrop-blur-2xl border-t border-[#C5A059]/30 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-4">
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.id ||
                (link.hasMegaMenu && (activeTab === 'projects' || activeTab === 'category'));

              if (link.hasMegaMenu) {
                return (
                  <div key={link.id} className="border-b border-white/10 pb-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onNavigate('projects');
                        }}
                        className={`text-lg uppercase tracking-widest font-serif font-bold ${
                          isActive ? 'text-[#F5D07F]' : 'text-white'
                        }`}
                      >
                        Our Projects
                      </button>
                      <button
                        onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                        className="p-2 text-[#F5D07F]"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            mobileCategoriesExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {mobileCategoriesExpanded && (
                      <div className="mt-3 pl-4 space-y-2.5 border-l border-[#C5A059]/40">
                        {Object.values(CATEGORIES_DATA).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                            className="block w-full text-left text-sm text-[#EBE5D8] hover:text-[#F5D07F] py-1 font-medium"
                          >
                            {cat.title}
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
                  className={`block w-full text-left text-lg uppercase tracking-widest font-serif font-bold border-b border-white/10 pb-3 transition-colors ${
                    isActive ? 'text-[#F5D07F]' : 'text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#C5A059]/30 space-y-4">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onRequestSwatches();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E2C37E] to-[#C5A059] text-[#121110] uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <PackageCheck className="w-4 h-4 text-[#121110] stroke-[2.5]" />
              <span>Order Complimentary Swatches</span>
            </button>
            <div className="flex items-center justify-center space-x-2 text-xs text-[#EBE5D8] font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-[#F5D07F]" />
              <span>Mayfair Showroom: +44 20 7946 0188</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
