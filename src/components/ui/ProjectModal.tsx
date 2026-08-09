import React, { useState } from 'react';
import type { Project, CategorySlug } from '../../types';
import { X, MapPin, Calendar, UserCheck, ArrowRight, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateToCategory: (categorySlug: CategorySlug) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNavigateToCategory
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0F1714] border border-[#C9A56A]/30 rounded-3xl overflow-y-auto text-[#E9DFD1] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-[#E9DFD1] hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all border border-white/20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Gallery Banner */}
        <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden bg-black">
          <img
            src={project.gallery[activeImageIndex] || project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1714] via-transparent to-black/30"></div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block mb-1">
                {project.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#E9DFD1] font-normal leading-tight">
                {project.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {project.gallery.length > 1 && (
          <div className="px-6 py-3 bg-[#163129] border-b border-[#C9A56A]/20 flex items-center space-x-3 overflow-x-auto">
            {project.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#C9A56A] scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Project Meta & Narrative */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/10 text-xs text-[#8C9A90]">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-[#C9A56A]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C9A90]">Location</span>
                <strong className="text-[#E9DFD1]">{project.location}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-[#C9A56A]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C9A90]">Completion</span>
                <strong className="text-[#E9DFD1]">{project.year}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4 text-[#C9A56A]" />
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C9A90]">Interior Designer</span>
                <strong className="text-[#E9DFD1]">{project.designer}</strong>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl text-[#C9A56A] mb-3">Architectural Narrative</h3>
            <p className="text-sm text-[#8C9A90] leading-relaxed font-light font-subserif text-base sm:text-lg">
              {project.description}
            </p>
          </div>

          {/* Products Specified */}
          <div className="bg-[#163129] p-6 rounded-2xl border border-[#C9A56A]/20">
            <h4 className="font-serif text-base text-[#E9DFD1] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C9A56A]" />
              <span>Key Furnishing Products Specified</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.productsUsed.map((prod, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onNavigateToCategory(prod.categorySlug);
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl bg-[#0F1714] border border-white/10 hover:border-[#C9A56A] hover:bg-[#C9A56A]/10 transition-all text-left cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-medium text-[#E9DFD1] group-hover:text-[#C9A56A] transition-colors block">
                      {prod.productName}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C9A90] block">
                      {prod.categorySlug.replace('-', ' ')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C9A56A] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
