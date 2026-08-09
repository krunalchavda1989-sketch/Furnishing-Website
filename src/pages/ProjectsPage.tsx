import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import type { Project, CategorySlug } from '../types';
import { MapPin, ArrowUpRight, Compass, Filter } from 'lucide-react';

interface ProjectsPageProps {
  onOpenProject: (project: Project) => void;
  onNavigateToCategory: (categorySlug: CategorySlug) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onOpenProject,
  onNavigateToCategory
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tags = ['All', 'Private Residence', 'Coastal Estate', 'Penthouse Sanctuary', 'Bespoke Yacht'];

  const filteredProjects =
    selectedTag === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <div className="pt-28 sm:pt-36 pb-24 space-y-16">
      {/* Intro Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-medium block">
          Interior Architecture Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#0F1714] font-normal">
          Curated <span className="italic font-subserif gold-gradient-text">Residences & Sanctuaries</span>
        </h1>
        <p className="text-sm sm:text-base text-[#2C3A33] font-light leading-relaxed max-w-2xl mx-auto font-subserif text-lg">
          Explore completed international commissions featuring bespoke acoustic drapery, hand-knotted Tibetan silk floor coverings, and tailored upholstery.
        </p>
      </section>

      {/* Persistent Category Hub Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F1714] text-[#E9DFD1] p-6 sm:p-8 rounded-3xl border border-[#C9A56A]/30 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C9A56A]/20">
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold flex items-center gap-2">
              <Compass className="w-4 h-4" /> Category Hub — Direct Access to All 8 Product Archives
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.values(CATEGORIES_DATA).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigateToCategory(cat.id as CategorySlug)}
                className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A56A] hover:bg-[#C9A56A]/15 transition-all text-left flex flex-col justify-between h-24 cursor-pointer"
              >
                <span className="text-xs font-serif text-[#E9DFD1] group-hover:text-[#C9A56A] transition-colors leading-snug">
                  {cat.title}
                </span>
                <span className="text-[10px] uppercase text-[#C9A56A] font-medium tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#8C9A90]/40">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#C9A56A]" />
            <span className="text-xs uppercase tracking-widest text-[#0F1714] font-bold">
              Filter Portfolio:
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#0F1714] text-[#C9A56A]'
                    : 'bg-[#DFD5C5] text-[#2C3A33] hover:bg-[#8C9A90]/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer bg-[#E9DFD1] rounded-3xl overflow-hidden border border-[#C9A56A]/20 shadow-xl hover:border-[#C9A56A] transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative h-[400px] w-full overflow-hidden">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4 glass-panel-dark px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-[#C9A56A]">
                  {project.category}
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-[#E9DFD1]">
                  <span className="text-xs text-[#8C9A90] font-light block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A56A]" /> {project.location} • {project.year}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#E9DFD1] font-normal group-hover:text-[#C9A56A] transition-colors mt-1">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-[#2C3A33] line-clamp-2 leading-relaxed font-light">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#DFD5C5]">
                  <span className="text-xs text-[#8C9A90]">
                    Designer: <strong className="text-[#0F1714]">{project.designer}</strong>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C9A56A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Commission <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
