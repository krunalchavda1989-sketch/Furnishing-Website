import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CategoryPage } from './pages/CategoryPage';
import { BrandsPage } from './pages/BrandsPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectModal } from './components/ui/ProjectModal';
import { SampleRequestModal } from './components/ui/SampleRequestModal';
import type { CategorySlug, Project } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategorySlug, setActiveCategorySlug] = useState<CategorySlug>('fabrics');
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, activeCategorySlug]);

  const handleNavigate = (tab: string, categorySlug?: CategorySlug) => {
    if (categorySlug) {
      setActiveCategorySlug(categorySlug);
      setActiveTab('category');
    } else {
      setActiveTab(tab);
    }
  };

  const handleNavigateToCategory = (catSlug: CategorySlug) => {
    setActiveCategorySlug(catSlug);
    setActiveTab('category');
  };

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#FDFBF7] text-[#1A1918] flex flex-col font-sans selection:bg-[#C5A059]/30">
        {/* Sticky Header Navigation */}
        <Navbar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onRequestSwatches={() => setIsSampleModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="grow">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenProject={(prj) => setSelectedProjectModal(prj)}
              onRequestSwatches={() => setIsSampleModalOpen(true)}
            />
          )}

          {activeTab === 'story' && <StoryPage />}

          {activeTab === 'projects' && (
            <ProjectsPage
              onOpenProject={(prj) => setSelectedProjectModal(prj)}
              onNavigateToCategory={handleNavigateToCategory}
            />
          )}

          {activeTab === 'category' && (
            <CategoryPage
              categorySlug={activeCategorySlug}
              onNavigate={handleNavigate}
              onRequestSwatches={() => setIsSampleModalOpen(true)}
            />
          )}

          {activeTab === 'brands' && <BrandsPage />}

          {activeTab === 'contact' && <ContactPage />}
        </main>

        {/* Global Footer */}
        <Footer
          onNavigate={handleNavigate}
          onRequestSwatches={() => setIsSampleModalOpen(true)}
        />

        {/* Interactive Lightbox & Request Modals */}
        <ProjectModal
          project={selectedProjectModal}
          onClose={() => setSelectedProjectModal(null)}
          onNavigateToCategory={handleNavigateToCategory}
        />

        <SampleRequestModal
          isOpen={isSampleModalOpen}
          onClose={() => setIsSampleModalOpen(false)}
          defaultCategory={activeCategorySlug}
        />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
