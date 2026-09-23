import React, { useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { SHOWROOMS_DATA } from '../data/brandsData';
import type { Showroom, SiteSettings } from '../types';
import {
  MapPin,
  Phone,
  Smartphone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Share2,
  MessageCircle
} from 'lucide-react';
import {
  InstagramIcon,
  PinterestIcon,
  LinkedInIcon,
  YouTubeIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon
} from '../components/ui/SocialIcons';
import {
  submitContactInquiryInSupabase,
  fetchShowroomsFromSupabase,
  fetchSiteSettingsFromSupabase,
  DEFAULT_SITE_SETTINGS
} from '../lib/supabase';
import { useToast } from '../components/ui/ToastNotification';

interface ContactPageProps {
  siteSettings?: SiteSettings;
  showrooms?: Showroom[];
}

export const ContactPage: React.FC<ContactPageProps> = ({
  siteSettings: initialSettings,
  showrooms: initialShowrooms
}) => {
  const [showrooms, setShowrooms] = useState<Showroom[]>(initialShowrooms || SHOWROOMS_DATA);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [selectedShowroomIndex, setSelectedShowroomIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    productInterest: 'fabrics',
    projectScope: 'Full Residence Refurbishment',
    message: ''
  });

  useEffect(() => {
    if (initialSettings) {
      setSiteSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    if (initialShowrooms && initialShowrooms.length > 0) {
      setShowrooms(initialShowrooms);
    }
  }, [initialShowrooms]);

  // Fetch dynamic showrooms & site settings on mount and listen to storage updates
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [shwData, settingsData] = await Promise.all([
          fetchShowroomsFromSupabase(),
          fetchSiteSettingsFromSupabase()
        ]);
        if (shwData && shwData.length > 0) {
          setShowrooms(shwData);
        }
        if (settingsData) {
          setSiteSettings(settingsData);
        }
      } catch (err) {
        console.warn('Error loading dynamic contact data:', err);
      }
    };

    loadDynamicData();

    // Listen to local storage changes for cross-tab or master admin updates
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === 'atelier_custom_showrooms' ||
        e.key === 'atelier_deleted_showrooms' ||
        e.key === 'atelier_site_settings' ||
        e.key === 'atelier_contact_settings'
      ) {
        loadDynamicData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeShowroom = showrooms[selectedShowroomIndex] || showrooms[0] || SHOWROOMS_DATA[0];
  const socials = siteSettings.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email) return;

    setIsSubmitting(true);

    const categoryTitle =
      CATEGORIES_DATA[formState.productInterest as keyof typeof CATEGORIES_DATA]?.title || formState.productInterest;

    await submitContactInquiryInSupabase({
      clientName: formState.fullName,
      email: formState.email,
      phone: formState.phone,
      productInterest: categoryTitle,
      projectScope: formState.projectScope,
      preferredShowroom: `${activeShowroom.city} Showroom (${activeShowroom.country})`,
      message: formState.message || 'Consultation request submitted from website contact portal.'
    });

    setIsSubmitting(false);
    showToast('Inquiry Submitted', 'Our head drapery specialist will contact you within 24 hours.', 'success');
    setSubmitted(true);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16 font-sans">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block">
          Private Atelier Consultations
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] font-normal">
          Connect With Our <span className="italic font-subserif gold-gradient-text">Design Specialists</span>
        </h1>
        <p className="text-sm sm:text-base text-[#2C3A33] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          Whether commissioning bespoke drapes for a historic manor or selecting acoustic sheers for a commercial penthouse, our {showrooms.slice(0, 3).map((s) => s.city.replace(' Showroom', '').replace(' Atelier', '').replace(' Design Studio', '').replace(' Gallery', '')).join(', ')} specialists are at your service.
        </p>
      </section>

      {/* Dynamic Communications, Operating Schedule & Socials Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Direct Mobile & Telephone */}
          <div className="bg-[#0F1714] rounded-3xl p-6 border border-[#C9A56A]/30 text-[#E9DFD1] shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A56A]/10 border border-[#C9A56A]/30 flex items-center justify-center text-[#C9A56A]">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A] block">
                Direct Telephony & Mobile
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Private Concierge Line</h3>
              <p className="text-xs text-[#8C9A90] font-light">
                Direct mobile line for architects, interior designers, and VIP clients.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <a
                href={`tel:${siteSettings.mobileNumber.replace(/\s+/g, '')}`}
                className="flex items-center space-x-2 text-[#E9DFD1] hover:text-[#C9A56A] transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#C9A56A] shrink-0" />
                <span className="font-mono font-semibold">{siteSettings.mobileNumber}</span>
              </a>
              <a
                href={`tel:${siteSettings.primaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-2 text-[#8C9A90] hover:text-[#C9A56A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A56A]/70 shrink-0" />
                <span className="font-mono">{siteSettings.primaryPhone}</span>
              </a>
              {siteSettings.whatsappNumber && (
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold hover:underline pt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge Available</span>
                </a>
              )}
            </div>
          </div>

          {/* Card 2: Email Inquiries & VIP Services */}
          <div className="bg-[#0F1714] rounded-3xl p-6 border border-[#C9A56A]/30 text-[#E9DFD1] shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A56A]/10 border border-[#C9A56A]/30 flex items-center justify-center text-[#C9A56A]">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A] block">
                Official Correspondences
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Email Routing Channels</h3>
              <p className="text-xs text-[#8C9A90] font-light">
                Direct inboxes monitored by our Mayfair, Paris, and Milan textile curators.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[#8C9A90] block uppercase tracking-wider">General Inquiries</span>
                <a
                  href={`mailto:${siteSettings.generalEmail}`}
                  className="font-medium text-[#E9DFD1] hover:text-[#C9A56A] transition-colors truncate block"
                >
                  {siteSettings.generalEmail}
                </a>
              </div>
              <div>
                <span className="text-[10px] text-[#8C9A90] block uppercase tracking-wider">VIP & Bespoke</span>
                <a
                  href={`mailto:${siteSettings.vipEmail}`}
                  className="font-medium text-[#C9A56A] hover:underline truncate block"
                >
                  {siteSettings.vipEmail}
                </a>
              </div>
              {siteSettings.tradeEmail && (
                <div>
                  <span className="text-[10px] text-[#8C9A90] block uppercase tracking-wider">Trade & Architects</span>
                  <a
                    href={`mailto:${siteSettings.tradeEmail}`}
                    className="font-medium text-[#E9DFD1] hover:text-[#C9A56A] transition-colors truncate block"
                  >
                    {siteSettings.tradeEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Store Open / Close Timetable Schedule */}
          <div className="bg-[#0F1714] rounded-3xl p-6 border border-[#C9A56A]/30 text-[#E9DFD1] shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A56A]/10 border border-[#C9A56A]/30 flex items-center justify-center text-[#C9A56A]">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A] block">
                Atelier Timetable
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Store Operating Hours</h3>
              <p className="text-xs text-[#8C9A90] font-light">
                Public opening schedule & bespoke private appointments.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5 text-xs text-[#E9DFD1]">
              <div className="flex justify-between items-center">
                <span className="text-[#8C9A90]">Mon – Fri:</span>
                <span className="font-mono font-medium">{siteSettings.scheduleMonFri}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8C9A90]">Saturday:</span>
                <span className="font-mono font-medium">{siteSettings.scheduleSat}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8C9A90]">Sunday:</span>
                <span className="text-[11px] text-[#C9A56A] font-semibold">{siteSettings.scheduleSun}</span>
              </div>
              {siteSettings.scheduleHolidays && (
                <div className="text-[10px] text-[#8C9A90] italic pt-1 border-t border-white/5">
                  *{siteSettings.scheduleHolidays}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Official Social Media Accounts */}
          <div className="bg-[#0F1714] rounded-3xl p-6 border border-[#C9A56A]/30 text-[#E9DFD1] shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A56A]/10 border border-[#C9A56A]/30 flex items-center justify-center text-[#C9A56A]">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A] block">
                Atelier Community
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Social Media Channels</h3>
              <p className="text-xs text-[#8C9A90] font-light">
                Explore behind-the-scenes weaving, silk dyeing, and installation archives.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socials.instagram?.enabled && socials.instagram?.url && (
                <a
                  href={socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <InstagramIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>Instagram</span>
                </a>
              )}

              {socials.pinterest?.enabled && socials.pinterest?.url && (
                <a
                  href={socials.pinterest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <PinterestIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>Pinterest</span>
                </a>
              )}

              {socials.linkedin?.enabled && socials.linkedin?.url && (
                <a
                  href={socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <LinkedInIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>LinkedIn</span>
                </a>
              )}

              {socials.youtube?.enabled && socials.youtube?.url && (
                <a
                  href={socials.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <YouTubeIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>YouTube</span>
                </a>
              )}

              {socials.facebook?.enabled && socials.facebook?.url && (
                <a
                  href={socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <FacebookIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>Facebook</span>
                </a>
              )}

              {socials.twitter?.enabled && socials.twitter?.url && (
                <a
                  href={socials.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <TwitterIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>Twitter / X</span>
                </a>
              )}

              {socials.whatsapp?.enabled && socials.whatsapp?.url && (
                <a
                  href={socials.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-[#C9A56A] hover:text-[#0F1714] border border-white/10 text-center text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1 group text-[#8C9A90]"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#C9A56A] group-hover:text-[#0F1714] transition-colors" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Dynamic Showroom Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#0F1714] rounded-3xl p-8 sm:p-12 border border-[#C9A56A]/30 text-[#E9DFD1] shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Bespoke Inquiry & Trade Registration
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#E9DFD1] mt-1">
                Schedule a Consultation or Request Quote
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-[#163129] rounded-2xl border border-[#C9A56A]/40 p-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#0F1714] border border-[#C9A56A] flex items-center justify-center mx-auto text-[#C9A56A]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#E9DFD1]">Inquiry Received & Synced</h3>
                <p className="text-xs text-[#8C9A90] max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-[#E9DFD1]">{formState.fullName}</strong>. Your inquiry has been transmitted directly to our Master Admin portal and senior textile consultants at our {activeShowroom.city} showroom. We will review your project scope within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({
                      fullName: '',
                      email: '',
                      phone: '',
                      productInterest: 'fabrics',
                      projectScope: 'Full Residence Refurbishment',
                      message: ''
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-widest hover:bg-[#E6C894] transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alistair Vance"
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alistair@vanceholdings.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 7911 123456"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-1 font-medium">
                      Product Interest Category
                    </label>
                    <select
                      value={formState.productInterest}
                      onChange={(e) => setFormState({ ...formState, productInterest: e.target.value })}
                      className="w-full bg-[#163129] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#E9DFD1] focus:outline-none focus:border-[#C9A56A] cursor-pointer"
                    >
                      {Object.values(CATEGORIES_DATA).map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0F1714]">
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8C9A90] block mb-1 font-medium">
                    Project Scope / Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your residence, timeline, dimensions, or design vision..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[#163129] border border-white/15 rounded-xl p-4 text-xs text-[#E9DFD1] placeholder-[#8C9A90] focus:outline-none focus:border-[#C9A56A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#C9A56A] text-[#0F1714] font-bold uppercase tracking-widest text-xs hover:bg-[#E6C894] transition-all flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Request Private Consultation'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Dynamic Showrooms Switcher */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
                Global Flagships & Design Hubs
              </span>
              <h2 className="font-serif text-3xl text-[#0F1714] font-normal">Our Showrooms</h2>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {showrooms.map((sr, idx) => (
                <div
                  key={sr.id}
                  onClick={() => setSelectedShowroomIndex(idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedShowroomIndex === idx
                      ? 'bg-[#0F1714] text-[#E9DFD1] border-[#C9A56A] shadow-xl'
                      : 'bg-white text-[#0F1714] border-black/10 hover:border-[#C9A56A]/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#C9A56A] font-bold">
                        {sr.country}
                      </span>
                      {sr.isFlagship && (
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#C9A56A]/20 text-[#C9A56A] border border-[#C9A56A]/40 font-bold">
                          Flagship
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold">{sr.city} Showroom</h3>
                    <p className="text-xs opacity-75">{sr.address}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedShowroomIndex === idx ? 'bg-[#C9A56A] text-[#0F1714]' : 'bg-black/5 text-[#0F1714]'
                    }`}
                  >
                    &rarr;
                  </div>
                </div>
              ))}
            </div>

            {/* Active Showroom Detailed Card */}
            <div className="bg-[#E9DFD1] rounded-3xl p-6 border border-[#C9A56A]/20 space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
                <img
                  src={activeShowroom.image}
                  alt={activeShowroom.city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A56A]">
                      Private Appointments
                    </span>
                    <h4 className="font-serif text-xl font-bold">{activeShowroom.city} Atelier</h4>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#2C3A33]">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#C9A56A] shrink-0" />
                  <span>{activeShowroom.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#C9A56A] shrink-0" />
                  <a href={`tel:${activeShowroom.phone.replace(/\s+/g, '')}`} className="hover:underline">
                    {activeShowroom.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#C9A56A] shrink-0" />
                  <a href={`mailto:${activeShowroom.email}`} className="hover:underline truncate">
                    {activeShowroom.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#C9A56A] shrink-0" />
                  <span>{activeShowroom.hours}</span>
                </div>
                {activeShowroom.notes && (
                  <div className="pt-2 text-[11px] text-[#5C6A63] italic border-t border-[#C9A56A]/20">
                    "{activeShowroom.notes}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
