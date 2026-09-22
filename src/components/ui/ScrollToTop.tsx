import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-8 pointer-events-none scale-90'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
        className="relative group p-3.5 sm:p-4 rounded-full bg-[#0F1714]/90 backdrop-blur-xl border border-[#C9A56A]/60 text-[#C9A56A] hover:text-[#0F1714] hover:bg-[#C9A56A] shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(201,165,106,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
      >
        {/* Progress SVG Ring around button */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="21"
            className="text-white/10 stroke-current"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="21"
            className="text-[#C9A56A] stroke-current transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={132}
            strokeDashoffset={132 - (132 * scrollProgress) / 100}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Up Arrow Icon with upward hover translation */}
        <ArrowUp className="w-5 h-5 stroke-[2.5] relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />

        {/* Subtle Pulse Glow */}
        <span className="absolute -inset-1 rounded-full bg-[#C9A56A]/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping -z-10 pointer-events-none" />
      </button>
    </div>
  );
};
