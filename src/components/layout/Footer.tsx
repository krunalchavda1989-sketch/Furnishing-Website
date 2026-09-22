import React, { useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import { SHOWROOMS_DATA } from '../../data/brandsData';
import type { CategorySlug, Showroom, SiteSettings } from '../../types';
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Compass,
  Smartphone
} from 'lucide-react';
import {
  InstagramIcon,
  PinterestIcon,
  LinkedInIcon,
  YouTubeIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon
} from '../ui/SocialIcons';
import {
  subscribeNewsletterInSupabase,
  fetchSiteSettingsFromSupabase,
  fetchShowroomsFromSupabase,
  DEFAULT_SITE_SETTINGS
} from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';

interface FooterProps {
  siteSettings?: SiteSettings;
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onRequestSwatches: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteSettings: initialSettings,
  onNavigate,
  onRequestSwatches
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [primaryShowroom, setPrimaryShowroom] = useState<Showroom>(SHOWROOMS_DATA[0]);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialSettings) {
      setSiteSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const [settings, shws] = await Promise.all([
          fetchSiteSettingsFromSupabase(),
          fetchShowroomsFromSupabase()
        ]);
        if (settings) setSiteSettings(settings);
        if (shws && shws.length > 0) {
          const flagship = shws.find((s) => s.isFlagship) || shws[0];
          setPrimaryShowroom(flagship);
        }
      } catch (e) {
        console.warn('Error loading footer contact data:', e);
      }
    };
    loadFooterData();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'atelier_site_settings' || e.key === 'atelier_contact_settings') {
        loadFooterData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    await subscribeNewsletterInSupabase(email, 'Footer Gazette');
    setSubscribed(true);
    showToast('Subscribed to Gazette', `Lookbook sent to ${email}`, 'success');
    setEmail('');
    setIsSubmitting(false);
    setTimeout(() => setSubscribed(false), 5000);
  };

  const hasFooterLogoImage = Boolean(
    (siteSettings.footerLogoImage && siteSettings.footerLogoImage.trim() !== '') ||
    (siteSettings.headerLogoImage && siteSettings.headerLogoImage.trim() !== '')
  );
  const footerLogoSrc = siteSettings.footerLogoImage || siteSettings.headerLogoImage;

  const socials = siteSettings.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks;

  return (
    <footer className="bg-[#0F1714] text-[#E9DFD1] pt-20 pb-12 border-t border-[#C9A56A]/30 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A56A]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Banner Section */}
        <div className="bg-[#163129] rounded-3xl p-8 lg:p-12 border border-[#C9A56A]/20 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block mb-2">
              The Atelier Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#E9DFD1] leading-tight">
              Receive Curated Textile Archives & Private Exhibition Invitations
            </h3>
            <p className="text-sm text-[#8C9A90] mt-2 font-light">
              Subscribe to receive our seasonal lookbooks, material sourcing documentaries, and private showroom events.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[400px]">
            {subscribed ? (
              <div className="bg-[#0F1714] text-[#E9DFD1] p-4 rounded-xl border border-[#C9A56A]/40 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A56A]" />
                <span className="text-xs tracking-wider uppercase font-medium">
                  Welcome to The Atelier Circle. Lookbook sent.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-[#C9A56A] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-[#0F1714] text-[#E9DFD1] placeholder-[#8C9A90] text-sm pl-11 pr-28 py-3.5 rounded-full border border-[#C9A56A]/30 focus:outline-none focus:border-[#C9A56A]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C9A56A] text-[#0F1714] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#E6C894] transition-all flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Joining...' : 'Join'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Navigation & Branding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 group text-left focus:outline-none cursor-pointer"
            >
              {hasFooterLogoImage ? (
                <div className="h-10 flex items-center">
                  <img
                    src={footerLogoSrc}
                    alt={siteSettings.footerLogoTitle || 'Atelier Living'}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-full border border-[#C9A56A] flex items-center justify-center bg-[#C9A56A]/10 group-hover:bg-[#C9A56A] transition-colors">
                    <span className="font-serif font-bold text-base text-[#C9A56A] group-hover:text-[#0F1714] transition-colors">
                      {siteSettings.footerLogoMonogram || 'A'}
                    </span>
                  </div>
                  <span className="font-serif tracking-widest text-xl font-semibold uppercase text-[#E9DFD1] group-hover:text-[#C9A56A] transition-colors">
                    {siteSettings.footerLogoTitle || 'Atelier Living'}
                  </span>
                </>
              )}
            </button>

            <p className="text-xs text-[#8C9A90] leading-relaxed font-light pr-6">
              {siteSettings.footerDescription ||
                'Atelier Living is an international interior design house crafting bespoke textiles, architectural drapes, structural upholstery, hand-knotted rugs, and limited-edition atelier artifacts for fine private residences, superyachts, and boutique luxury hotels.'}
            </p>

            {/* Managed Social Media Icons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {socials.instagram?.enabled && socials.instagram?.url && (
                <a
                  href={socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Atelier"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}

              {socials.pinterest?.enabled && socials.pinterest?.url && (
                <a
                  href={socials.pinterest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest Archives"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="Pinterest"
                >
                  <PinterestIcon className="w-4 h-4" />
                </a>
              )}

              {socials.linkedin?.enabled && socials.linkedin?.url && (
                <a
                  href={socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Atelier"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}

              {socials.youtube?.enabled && socials.youtube?.url && (
                <a
                  href={socials.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
              )}

              {socials.facebook?.enabled && socials.facebook?.url && (
                <a
                  href={socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Atelier"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}

              {socials.twitter?.enabled && socials.twitter?.url && (
                <a
                  href={socials.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="X / Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}

              {socials.whatsapp?.enabled && socials.whatsapp?.url && (
                <a
                  href={socials.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Concierge"
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all"
                  title="WhatsApp Concierge"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={() => onNavigate('contact')}
                aria-label="Navigation Hub"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#8C9A90] hover:text-[#0F1714] hover:bg-[#C9A56A] hover:border-[#C9A56A] transition-all cursor-pointer"
                title="Atelier Directory"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C9A56A] mb-4 font-semibold">
              Product Archives
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8C9A90]">
              {Object.values(CATEGORIES_DATA).slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.id as CategorySlug)}
                    className="hover:text-[#C9A56A] transition-colors cursor-pointer"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C9A56A] mb-4 font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8C9A90]">
              {Object.values(CATEGORIES_DATA).slice(4, 8).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.id as CategorySlug)}
                    className="hover:text-[#C9A56A] transition-colors cursor-pointer"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom & Contact Coordinates */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C9A56A] mb-4 font-semibold">
              {primaryShowroom.city} Atelier
            </h4>
            <div className="space-y-3 text-xs text-[#8C9A90]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C9A56A] shrink-0 mt-0.5" />
                <span>{siteSettings.flagshipAddress || primaryShowroom.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C9A56A] shrink-0" />
                <span>{siteSettings.primaryPhone || primaryShowroom.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#C9A56A] shrink-0" />
                <span>{siteSettings.mobileNumber || '+44 7911 123456'}</span>
              </div>
              <button
                onClick={onRequestSwatches}
                className="w-full mt-2 py-2 rounded-lg bg-[#C9A56A]/10 border border-[#C9A56A]/40 text-[#C9A56A] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all cursor-pointer"
              >
                Order Material Swatches
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & System Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C9A90] gap-4">
          <p>{siteSettings.footerCopyright || `© ${new Date().getFullYear()} Atelier Living Ltd. All rights reserved.`}</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('story')} className="hover:text-[#C9A56A] cursor-pointer">
              Craft Philosophy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#C9A56A] cursor-pointer">
              Private Consultation
            </button>
            <button onClick={() => onNavigate('admin')} className="text-[#C9A56A] font-bold hover:underline flex items-center gap-1 cursor-pointer">
              <span>Master Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
