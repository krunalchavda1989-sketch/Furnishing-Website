import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import type { SiteSettings } from '../../types';

interface FloatingWhatsAppProps {
  siteSettings?: SiteSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ siteSettings }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if disabled by admin
  if (siteSettings?.whatsappFloatingEnabled === false) {
    return null;
  }

  const isLeft = siteSettings?.whatsappFloatingPosition === 'bottom-left';
  const rawNumber =
    siteSettings?.whatsappFloatingNumber ||
    siteSettings?.whatsappNumber ||
    siteSettings?.socialLinks?.whatsapp?.url ||
    '+44 7911 123456';

  // Format phone number to pure digits for wa.me API
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '');
  const message =
    siteSettings?.whatsappFloatingMessage ||
    'Hello Atelier Living Concierge, I would like to inquire about bespoke furnishings.';
  const tooltipText = siteSettings?.whatsappFloatingTooltip || 'Chat with Concierge';

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ease-out ${
        isLeft ? 'bottom-6 left-6 sm:bottom-8 sm:left-8' : 'bottom-6 right-6 sm:bottom-8 sm:right-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip / Concierge Badge */}
      <div
        className={`absolute bottom-full mb-3 pointer-events-none transition-all duration-300 transform ${
          isLeft ? 'left-0' : 'right-0'
        } ${
          isHovered
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="glass-panel-dark bg-[#0F1714]/95 border border-[#C9A56A]/40 rounded-2xl p-3 shadow-2xl min-w-[210px] text-left">
          <div className="flex items-center space-x-2 pb-1.5 border-b border-white/10 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A56A] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Concierge Online
            </span>
          </div>
          <p className="text-xs font-serif font-medium text-white">{tooltipText}</p>
          <p className="text-[10px] text-[#8C9A90] mt-0.5 font-light truncate">
            Direct Private Client Desk
          </p>
        </div>
      </div>

      {/* Main Luxury Floating WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Direct WhatsApp Concierge"
        className="relative group flex items-center justify-center p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-[#0b6623] via-[#25D366] to-[#128C7E] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] border-2 border-[#E9DFD1]/60 hover:border-[#C9A56A] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Subtle glowing beacon wave */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-60" />
        <span className="absolute -inset-2 rounded-full bg-[#C9A56A]/20 animate-pulse pointer-events-none" />

        {/* Official WhatsApp Icon */}
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md relative z-10 transition-transform group-hover:rotate-12 duration-300" />
      </a>
    </div>
  );
};
