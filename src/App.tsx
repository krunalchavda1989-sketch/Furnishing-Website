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
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastProvider } from './components/ui/ToastNotification';
import type { CategorySlug, Project } from './types';
import type { AdminUser } from './types/adminTypes';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategorySlug, setActiveCategorySlug] = useState<CategorySlug>('fabrics');
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check URL pathname for /admin & restore saved admin session on initial load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/admin/login')) {
      setActiveTab('admin');
    }

    const savedSession = localStorage.getItem('maison_admin_session');
    if (savedSession) {
      try {
        setAdminUser(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem('maison_admin_session');
      }
    }
  }, []);

  // Listen to popstate / URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setActiveTab('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, activeCategorySlug]);

  const handleNavigate = (tab: string, categorySlug?: CategorySlug) => {
    if (categorySlug) {
      setActiveCategorySlug(categorySlug);
      setActiveTab('category');
      window.history.pushState({}, '', `/category/${categorySlug}`);
    } else {
      setActiveTab(tab);
      if (tab === 'admin') {
        window.history.pushState({}, '', '/admin');
      } else {
        window.history.pushState({}, '', tab === 'home' ? '/' : `/${tab}`);
      }
    }
  };

  const handleNavigateToCategory = (catSlug: CategorySlug) => {
    setActiveCategorySlug(catSlug);
    setActiveTab('category');
    window.history.pushState({}, '', `/category/${catSlug}`);
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setActiveTab('admin');
    window.history.pushState({}, '', '/admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('maison_admin_session');
  };

  return (
    <ToastProvider>
      {activeTab === 'admin' ? (
        !adminUser ? (
          <AdminLoginPage
            onLoginSuccess={handleAdminLoginSuccess}
            onReturnToSite={() => handleNavigate('home')}
          />
        ) : (
          <AdminDashboard
            user={adminUser}
            onLogout={handleAdminLogout}
            onReturnToSite={() => handleNavigate('home')}
          />
        )
      ) : (
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
      )}
    </ToastProvider>
  );
}

export default App;

