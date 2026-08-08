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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#1A1918]/90 backdrop-blur-lg border-b border-[#C5A059]/20 py-3 shadow-xl text-[#FDFBF7]'
          : 'bg-gradient-to-b from-[#1A1918]/80 via-[#1A1918]/40 to-transparent py-5 text-[#FDFBF7]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-[#C5A059]/50 flex items-center justify-center bg-[#C5A059]/10 group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/20 transition-all">
              <span className="font-serif font-bold text-lg text-[#C5A059]">M</span>
            </div>
            <div>
              <span className="font-serif tracking-widest text-lg sm:text-xl font-semibold uppercase text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors block">
                Maison & Drape
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-light block">
                Atelier Haute Living
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
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
                      className={`flex items-center space-x-1.5 text-sm uppercase tracking-widest font-medium py-2 transition-colors ${
                        activeTab === 'projects' || activeTab === 'category'
                          ? 'text-[#C5A059] border-b border-[#C5A059]'
                          : 'text-[#EBE5D8] hover:text-[#C5A059]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isMegaMenuOpen ? 'rotate-180 text-[#C5A059]' : ''
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isMegaMenuOpen && (
                      <div className="absolute top-full -left-48 w-[840px] glass-panel-dark rounded-2xl p-6 shadow-2xl border border-[#C5A059]/30 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="col-span-4 pb-3 mb-2 border-b border-[#C5A059]/20 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" /> Explore Furnishing Categories
                          </span>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              onNavigate('projects');
                            }}
                            className="text-xs text-[#EBE5D8] hover:text-[#C5A059] underline tracking-wider"
                          >
                            View All Projects Portfolio &rarr;
                          </button>
                        </div>

                        {Object.values(CATEGORIES_DATA).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                            className="group/card text-left p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-[#C5A059]/15 hover:border-[#C5A059]/40 transition-all flex flex-col justify-between"
                          >
                            <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2">
                              <img
                                src={cat.heroImage}
                                alt={cat.title}
                                className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/10 transition-colors"></div>
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#FDFBF7] group-hover/card:text-[#C5A059] transition-colors leading-snug">
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
                  className={`text-sm uppercase tracking-widest font-medium py-2 transition-colors ${
                    activeTab === link.id
                      ? 'text-[#C5A059] border-b border-[#C5A059]'
                      : 'text-[#EBE5D8] hover:text-[#C5A059]'
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
              className="px-5 py-2.5 rounded-full border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#1A1918] transition-all text-xs uppercase tracking-widest font-semibold flex items-center space-x-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Request Swatches</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={onRequestSwatches}
              className="px-3 py-1.5 rounded-full bg-[#C5A059] text-[#1A1918] text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Swatches</span>
            </button>

            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="p-2 rounded-lg text-[#FDFBF7] hover:text-[#C5A059] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 top-[70px] z-40 bg-[#1A1918]/95 backdrop-blur-2xl border-t border-[#C5A059]/20 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            {navLinks.map((link) => {
              if (link.hasMegaMenu) {
                return (
                  <div key={link.id} className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setIsMobileDrawerOpen(false);
                          onNavigate('projects');
                        }}
                        className="text-lg uppercase tracking-widest font-serif text-[#FDFBF7]"
                      >
                        Our Projects
                      </button>
                      <button
                        onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                        className="p-2 text-[#C5A059]"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            mobileCategoriesExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {mobileCategoriesExpanded && (
                      <div className="mt-3 pl-4 space-y-2.5 border-l border-[#C5A059]/30">
                        {Object.values(CATEGORIES_DATA).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id as CategorySlug)}
                            className="block w-full text-left text-sm text-[#D8C8B8] hover:text-[#C5A059] py-1"
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
                  className={`block w-full text-left text-lg uppercase tracking-widest font-serif border-b border-white/10 pb-4 transition-colors ${
                    activeTab === link.id ? 'text-[#C5A059]' : 'text-[#FDFBF7]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#C5A059]/20 space-y-3">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(false);
                onRequestSwatches();
              }}
              className="w-full py-3 rounded-xl bg-[#C5A059] text-[#1A1918] uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Order Complimentary Swatches</span>
            </button>
            <div className="flex items-center justify-center space-x-2 text-xs text-[#D8C8B8]">
              <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Mayfair Showroom: +44 20 7946 0188</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
