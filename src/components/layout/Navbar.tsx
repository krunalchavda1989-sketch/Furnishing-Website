import React, { useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug, SiteSettings, HeaderNavLink } from '../../types';
import { DEFAULT_SITE_SETTINGS, DEFAULT_HEADER_NAV_LINKS } from '../../lib/supabase';
import {
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Compass,
  PackageCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Phone,
  Search,
  ShoppingBag
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  siteSettings?: SiteSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onRequestSwatches: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  siteSettings = DEFAULT_SITE_SETTINGS,
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
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const navLinks: HeaderNavLink[] = (siteSettings?.navLinks && siteSettings.navLinks.length > 0
    ? siteSettings.navLinks
    : DEFAULT_HEADER_NAV_LINKS
  )
    .filter((link) => link.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleLinkClick = (link: HeaderNavLink) => {
    setIsMobileDrawerOpen(false);
    if (link.isExternal && link.target) {
      window.open(link.target, '_blank', 'noopener,noreferrer');
      return;
    }
    if (link.hasMegaMenu) {
      handleCategoryClick('fabrics');
      return;
    }
    onNavigate(link.target || link.id);
  };

  const hasHeaderLogoImage = Boolean(siteSettings?.headerLogoImage && siteSettings.headerLogoImage.trim() !== '');

  // Dynamic Typography & Sizing Helpers
  const getNavFontSizeClass = () => {
    switch (siteSettings.headerFontSize) {
      case '11px': return 'text-[11px]';
      case '12px': return 'text-[12px]';
      case '14px': return 'text-[14px]';
      case '15px': return 'text-[15px]';
      case '16px': return 'text-[16px]';
      case '13px':
      default: return 'text-[13px]';
    }
  };

  const getNavItemSpacingStyle = () => {
    switch (siteSettings.headerItemSpacing) {
      case '12px': return { gap: '12px' };
      case '18px': return { gap: '18px' };
      case '32px': return { gap: '32px' };
      case '40px': return { gap: '40px' };
      case '48px': return { gap: '48px' };
      case '24px':
      default: return { gap: '24px' };
    }
  };

  const getNavFontWeightClass = () => {
    switch (siteSettings.headerFontWeight) {
      case '300': return 'font-light';
      case '400': return 'font-normal';
      case '500': return 'font-medium';
      case '700': return 'font-bold';
      case '600':
      default: return 'font-semibold';
    }
  };

  const getNavLetterSpacingClass = () => {
    switch (siteSettings.headerLetterSpacing) {
      case 'tight': return 'tracking-normal';
      case 'normal': return 'tracking-wide';
      case 'wide': return 'tracking-wider';
      case 'wider': return 'tracking-[0.15em]';
      case 'widest':
      default: return 'tracking-[0.2em]';
    }
  };

  const getNavTextTransformClass = () => {
    switch (siteSettings.headerTextTransform) {
      case 'capitalize': return 'capitalize';
      case 'normal-case': return 'normal-case';
      case 'uppercase':
      default: return 'uppercase';
    }
  };

  const getHeaderPaddingClass = () => {
    if (isScrolled) {
      return 'py-2 sm:py-2.5';
    }
    switch (siteSettings.headerHeight) {
      case 'compact': return 'py-1.5 sm:py-2';
      case 'luxury': return 'py-4 sm:py-5';
      case 'standard':
      default: return 'py-2.5 sm:py-3.5';
    }
  };

  const getHeaderBackgroundClass = () => {
    if (isScrolled) {
      return 'bg-[#0F1714]/98 backdrop-blur-2xl shadow-2xl';
    }
    switch (siteSettings.headerBackgroundStyle) {
      case 'obsidian': return 'bg-[#0F1714]/98 backdrop-blur-2xl shadow-xl';
      case 'glass': return 'bg-black/60 backdrop-blur-2xl shadow-xl';
      case 'solid': return 'bg-[#0F1714] shadow-xl';
      case 'emerald':
      default: return 'bg-[#163129]/95 backdrop-blur-xl shadow-xl';
    }
  };

  const getHeaderBorderClass = () => {
    switch (siteSettings.headerBorderBottom) {
      case 'subtle': return 'border-b border-white/15';
      case 'glow': return 'border-b border-[#C9A56A] shadow-[0_4px_25px_rgba(201,165,106,0.25)]';
      case 'none': return 'border-b-0';
      case 'gold':
      default: return isScrolled ? 'border-b border-[#C9A56A]/50' : 'border-b border-[#C9A56A]/35';
    }
  };

  const logoHeight = siteSettings.headerLogoHeight || 40;

  return (
    <header
      className={`${
        siteSettings.headerSticky !== false ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-50'
      } transition-all duration-300 ${getHeaderBackgroundClass()} ${getHeaderBorderClass()}`}
    >
      {/* Optional Top Announcement / Utility Banner Ribbon */}
      {siteSettings.headerTopBarEnabled && siteSettings.headerTopBarText && (
        <div
          className={`text-center py-1.5 px-4 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase transition-all select-none ${
            siteSettings.headerTopBarBg === 'gold'
              ? 'bg-[#C9A56A] text-[#0F1714] font-bold'
              : siteSettings.headerTopBarBg === 'obsidian'
              ? 'bg-[#0F1714] text-[#C9A56A] border-b border-[#C9A56A]/30'
              : 'bg-[#163129] text-white border-b border-white/10'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 shrink-0 opacity-80" />
            {siteSettings.headerTopBarLink ? (
              <button
                onClick={() => onNavigate(siteSettings.headerTopBarLink || 'contact')}
                className="hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>{siteSettings.headerTopBarText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span>{siteSettings.headerTopBarText}</span>
            )}
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 ${getHeaderPaddingClass()} transition-all duration-300`}>
        <div className="flex items-center justify-between">
          {/* Header Brand Logo (Image or Customized Text Fallback) */}
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              onNavigate('home');
            }}
            className="flex items-center space-x-2 sm:space-x-3 group text-left focus:outline-none shrink-0 cursor-pointer"
          >
            {hasHeaderLogoImage ? (
              <div style={{ height: `${logoHeight}px` }} className="flex items-center transition-all duration-300">
                <img
                  src={siteSettings.headerLogoImage}
                  alt={siteSettings.headerLogoTitle || 'Atelier Living'}
                  style={{ maxHeight: `${logoHeight}px` }}
                  className="w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                />
              </div>
            ) : (
              <>
                <div
                  style={{ width: `${Math.max(36, logoHeight)}px`, height: `${Math.max(36, logoHeight)}px` }}
                  className="rounded-full border border-[#C9A56A] sm:border-2 flex items-center justify-center bg-[#C9A56A]/20 group-hover:bg-[#C9A56A] group-hover:shadow-[0_0_15px_rgba(201,165,106,0.5)] transition-all duration-300 shadow-md shrink-0"
                >
                  <span className="font-serif font-bold text-base sm:text-xl text-[#C9A56A] group-hover:text-[#0F1714] transition-colors">
                    {siteSettings?.headerLogoMonogram || 'A'}
                  </span>
                </div>
                <div className="leading-tight">
                  <span className="font-serif tracking-wider sm:tracking-widest text-sm sm:text-xl font-bold uppercase text-white group-hover:text-[#C9A56A] transition-colors block drop-shadow-sm">
                    {siteSettings?.headerLogoTitle || 'Atelier Living'}
                  </span>
                  <span className="hidden xs:block text-[8px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.28em] uppercase text-[#C9A56A] font-semibold">
                    {siteSettings?.headerLogoSubtitle || 'Designed For Inspired Living'}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* Dynamic Desktop Navigation Links */}
          <nav
            style={getNavItemSpacingStyle()}
            className="hidden lg:flex items-center justify-center transition-all duration-200"
          >
            {navLinks.map((link) => {
              const isActive =
                activeTab === link.target ||
                activeTab === link.id ||
                ((link.target === 'catalogue' || link.id === 'catalogue') && activeTab === 'category');

              const linkClasses = `relative ${getNavFontSizeClass()} ${getNavFontWeightClass()} ${getNavLetterSpacingClass()} ${getNavTextTransformClass()} px-2 py-1.5 transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'text-[#C9A56A] font-bold drop-shadow-[0_0_8px_rgba(201,165,106,0.4)]'
                  : 'text-white/90 hover:text-[#C9A56A]'
              }`;

              if (link.hasMegaMenu) {
                return (
                  <div
                    key={link.id}
                    className="relative"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleCategoryClick('fabrics')}
                      className={linkClasses}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isMegaMenuOpen ? 'rotate-180 text-[#C9A56A]' : isActive ? 'text-[#C9A56A]' : ''
                        }`}
                      />
                      {isActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#C9A56A] rounded-full shadow-[0_0_8px_rgba(201,165,106,0.8)]" />
                      )}
                    </button>

                    {/* Mega Menu Dropdown */}
                    {isMegaMenuOpen && (
                      <div className="absolute top-full -left-48 w-[840px] bg-[#0F1714]/98 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl border border-[#C9A56A]/40 grid grid-cols-4 gap-4 animate-in fade-in slide-from-top-3 duration-300 z-50">
                        <div className="col-span-4 pb-3 mb-2 border-b border-[#C9A56A]/30 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-1.5">
                            <Compass className="w-4 h-4 text-[#C9A56A]" /> Explore Product Catalogue (8 Archives)
                          </span>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              onRequestSwatches();
                            }}
                            className="text-xs text-white hover:text-[#C9A56A] underline tracking-wider font-medium cursor-pointer flex items-center gap-1"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-[#C9A56A]" /> Order Swatch Box &rarr;
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
                  onClick={() => handleLinkClick(link)}
                  className={linkClasses}
                >
                  <span>{link.label}</span>
                  {link.isExternal && <ExternalLink className="w-3 h-3 opacity-60" />}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#C9A56A] rounded-full shadow-[0_0_8px_rgba(201,165,106,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Search Trigger */}
            {siteSettings.headerShowSearch && (
              <button
                onClick={() => onNavigate('catalogue')}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#C9A56A]/20 border border-white/10 hover:border-[#C9A56A] text-white/90 hover:text-[#C9A56A] transition-all cursor-pointer shadow-sm"
                title="Search Catalogue & Collections"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Direct Concierge Contact Button */}
            {siteSettings.headerShowConcierge !== false && (
              <a
                href={`tel:${siteSettings.primaryPhone.replace(/\s+/g, '')}`}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#C9A56A]/20 border border-white/10 hover:border-[#C9A56A] text-[#C9A56A] transition-all cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-semibold"
                title={`Call Atelier VIP Concierge: ${siteSettings.primaryPhone}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px] font-mono">{siteSettings.primaryPhone}</span>
              </a>
            )}

            {/* Inquiry Bag / Cart Trigger */}
            {siteSettings.headerShowCart && (
              <button
                onClick={onRequestSwatches}
                className="p-2.5 rounded-full bg-white/5 hover:bg-[#C9A56A]/20 border border-white/10 hover:border-[#C9A56A] text-white/90 hover:text-[#C9A56A] transition-all cursor-pointer shadow-sm relative"
                title="View Inquiry Bag / Swatches"
                aria-label="Inquiry Bag"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}

            {/* Request Swatches CTA Button */}
            {siteSettings.headerShowSwatchesBtn !== false && (
              <button
                onClick={onRequestSwatches}
                className="px-4.5 py-2 rounded-full bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] hover:brightness-110 font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#C9A56A]/25 hover:shadow-[#C9A56A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5 border border-[#E9DFD1]/60 cursor-pointer"
              >
                <PackageCheck className="w-3.5 h-3.5 text-[#0F1714] stroke-[2.5]" />
                <span>Swatches</span>
              </button>
            )}
          </div>

          {/* Compact Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            {siteSettings.headerShowSwatchesBtn !== false && (
              <button
                onClick={onRequestSwatches}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#C9A56A] to-[#E6C894] text-[#0F1714] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md border border-[#E9DFD1]/50 shrink-0 cursor-pointer"
              >
                <PackageCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Swatches</span>
              </button>
            )}

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
                  activeTab === link.target ||
                  activeTab === link.id ||
                  ((link.target === 'catalogue' || link.id === 'catalogue') && activeTab === 'category');

                if (link.hasMegaMenu) {
                  return (
                    <div key={link.id} className="border-b border-white/10 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setIsMobileDrawerOpen(false);
                            onNavigate('category', 'fabrics');
                          }}
                          className={`text-base sm:text-lg uppercase tracking-wider font-serif font-bold text-left flex items-center gap-2 ${
                            isActive ? 'text-[#C9A56A]' : 'text-white hover:text-[#C9A56A]'
                          }`}
                        >
                          <span>{link.label}</span>
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
                    onClick={() => handleLinkClick(link)}
                    className={`block w-full text-left text-base sm:text-lg uppercase tracking-wider font-serif font-bold border-b border-white/10 pb-3 transition-colors ${
                      isActive ? 'text-[#C9A56A]' : 'text-white hover:text-[#C9A56A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.label}</span>
                      {link.isExternal && <ExternalLink className="w-4 h-4 text-[#C9A56A]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions in Dropdown */}
            <div className="pt-4 border-t border-[#C9A56A]/40 space-y-2.5 mt-4">
              {siteSettings.headerShowSwatchesBtn !== false && (
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
              )}

              {siteSettings.headerShowConcierge !== false && (
                <a
                  href={`tel:${siteSettings.primaryPhone.replace(/\s+/g, '')}`}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C9A56A]" />
                  <span>Private Consultation ({siteSettings.primaryPhone})</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
