import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../../data/categoriesData';
import type { CategorySlug } from '../../types';
import { Mail, CheckCircle2, ArrowRight, MapPin, Phone, Globe, Share2, Compass } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, categorySlug?: CategorySlug) => void;
  onRequestSwatches: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onRequestSwatches }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#1A1918] text-[#FDFBF7] pt-20 pb-12 border-t border-[#C5A059]/30 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Banner Section */}
        <div className="bg-[#242220] rounded-3xl p-8 lg:p-12 border border-[#C5A059]/20 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium block mb-2">
              The Maison Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7] leading-tight">
              Receive Curated Textile Archives & Private Exhibition Invitations
            </h3>
            <p className="text-sm text-[#D8C8B8] mt-2 font-light">
              Subscribe to receive our seasonal lookbooks, material sourcing documentaries, and private showroom events.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[400px]">
            {subscribed ? (
              <div className="bg-[#1C3026] text-[#FDFBF7] p-4 rounded-xl border border-[#C5A059]/40 flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059]" />
                <span className="text-xs tracking-wider uppercase font-medium">
                  Welcome to The Atelier Circle. Lookbook sent.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-[#1A1918] text-[#FDFBF7] placeholder-[#8C7A6B] text-sm pl-11 pr-28 py-3.5 rounded-full border border-[#C5A059]/30 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C5A059] text-[#1A1918] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-all flex items-center space-x-1"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#C5A059]/10">
                <span className="font-serif font-bold text-base text-[#C5A059]">M</span>
              </div>
              <span className="font-serif tracking-widest text-xl font-semibold uppercase text-[#FDFBF7]">
                Maison & Drape
              </span>
            </div>
            <p className="text-xs text-[#D8C8B8] leading-relaxed font-light pr-6">
              Maison & Drape is an international interior design house crafting bespoke textiles, architectural drapes, structural upholstery, hand-knotted rugs, and limited-edition atelier artifacts for fine private residences, superyachts, and boutique luxury hotels.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a href="#globe" aria-label="Global Showrooms" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#D8C8B8] hover:text-[#C5A059] hover:border-[#C5A059] transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#share" aria-label="Social Atelier" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#D8C8B8] hover:text-[#C5A059] hover:border-[#C5A059] transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#compass" aria-label="Navigation Hub" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#D8C8B8] hover:text-[#C5A059] hover:border-[#C5A059] transition-all">
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C5A059] mb-4 font-semibold">
              Product Archives
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8C8B8]">
              {Object.values(CATEGORIES_DATA).slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.id as CategorySlug)}
                    className="hover:text-[#C5A059] transition-colors"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C5A059] mb-4 font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8C8B8]">
              {Object.values(CATEGORIES_DATA).slice(4, 8).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', cat.id as CategorySlug)}
                    className="hover:text-[#C5A059] transition-colors"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom Snippet */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#C5A059] mb-4 font-semibold">
              Mayfair Showroom
            </h4>
            <div className="space-y-3 text-xs text-[#D8C8B8]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>42 Mayfair Square, London W1K 2PB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+44 20 7946 0188</span>
              </div>
              <button
                onClick={onRequestSwatches}
                className="w-full mt-2 py-2 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#C5A059] hover:text-[#1A1918] transition-all"
              >
                Order Material Swatches
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7A6B] gap-4">
          <p>© {new Date().getFullYear()} Maison & Drape Atelier Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('story')} className="hover:text-[#C5A059]">
              Craft Philosophy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#C5A059]">
              Private Consultation
            </button>
            <button onClick={() => onNavigate('admin')} className="text-[#C5A059] font-bold hover:underline flex items-center gap-1">
              <span>Master Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
