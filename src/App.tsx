import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import { ScrollToTop } from './components/ui/ScrollToTop';
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
import {
  fetchProjectsFromSupabase,
  fetchSiteSettingsFromSupabase,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_BRANDS_DATA,
  DEFAULT_STORY_SETTINGS,
  fetchTestimonialsFromSupabase,
  fetchBrandsFromSupabase,
  fetchStorySettingsFromSupabase
} from './lib/supabase';
import { PROJECTS_DATA } from './data/projectsData';
import type { CategorySlug, Project, SiteSettings, Testimonial, BrandPartner, StorySettings } from './types';
import type { AdminUser } from './types/adminTypes';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategorySlug, setActiveCategorySlug] = useState<CategorySlug>('fabrics');
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS_DATA);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [brandsList, setBrandsList] = useState<BrandPartner[]>(DEFAULT_BRANDS_DATA);
  const [storySettings, setStorySettings] = useState<StorySettings>(DEFAULT_STORY_SETTINGS);

  const loadLiveProjects = async () => {
    try {
      const data = await fetchProjectsFromSupabase();
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    } catch (err) {
      console.warn('Error loading live projects:', err);
    }
  };

  const loadLiveSiteSettings = async () => {
    try {
      const settings = await fetchSiteSettingsFromSupabase();
      if (settings) {
        setSiteSettings(settings);
      }
    } catch (err) {
      console.warn('Error loading live site settings:', err);
    }
  };

  const loadLiveTestimonials = async () => {
    try {
      const data = await fetchTestimonialsFromSupabase();
      if (data && data.length > 0) {
        setTestimonialsList(data);
      }
    } catch (err) {
      console.warn('Error loading live testimonials:', err);
    }
  };

  const loadLiveBrands = async () => {
    try {
      const data = await fetchBrandsFromSupabase();
      if (data && data.length > 0) {
        setBrandsList(data);
      }
    } catch (err) {
      console.warn('Error loading live brands:', err);
    }
  };

  const loadLiveStorySettings = async () => {
    try {
      const story = await fetchStorySettingsFromSupabase();
      if (story) {
        setStorySettings(story);
      }
    } catch (err) {
      console.warn('Error loading live story settings:', err);
    }
  };

  const loadAllData = () => {
    loadLiveProjects();
    loadLiveSiteSettings();
    loadLiveTestimonials();
    loadLiveBrands();
    loadLiveStorySettings();
  };

  // Check URL pathname for /admin & restore saved admin session on initial load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/admin/login')) {
      setActiveTab('admin');
    }

    const savedSession = localStorage.getItem('atelier_admin_session') || localStorage.getItem('maison_admin_session');
    if (savedSession) {
      try {
        setAdminUser(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem('atelier_admin_session');
        localStorage.removeItem('maison_admin_session');
      }
    }

    loadAllData();
  }, []);

  // Reload projects & settings whenever returning from admin or tab changes
  useEffect(() => {
    loadAllData();
  }, [activeTab]);

  // Listen to cross-tab / master admin storage updates for projects, site settings, testimonials, brands, story
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'atelier_custom_projects' || e.key === 'atelier_deleted_projects') {
        loadLiveProjects();
      }
      if (e.key === 'atelier_site_settings' || e.key === 'atelier_contact_settings') {
        loadLiveSiteSettings();
      }
      if (e.key === 'atelier_testimonials') {
        loadLiveTestimonials();
      }
      if (e.key === 'atelier_brands_data') {
        loadLiveBrands();
      }
      if (e.key === 'atelier_story_settings') {
        loadLiveStorySettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
    if (tab === 'catalogue') {
      const targetSlug = categorySlug || activeCategorySlug || 'fabrics';
      setActiveCategorySlug(targetSlug);
      setActiveTab('category');
      window.history.pushState({}, '', `/category/${targetSlug}`);
      return;
    }

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
    localStorage.removeItem('atelier_admin_session');
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
          <div className="min-h-screen bg-[#FDFBF7] text-[#1A1918] flex flex-col font-sans selection:bg-[#C5A059]/30 relative">
            {/* Sticky Header Navigation */}
            <Navbar
              activeTab={activeTab}
              siteSettings={siteSettings}
              onNavigate={handleNavigate}
              onRequestSwatches={() => setIsSampleModalOpen(true)}
            />

            {/* Main Content Area */}
            <main className="grow">
              {activeTab === 'home' && (
                <HomePage
                  projects={projectsList}
                  brands={brandsList}
                  testimonials={testimonialsList}
                  onNavigate={handleNavigate}
                  onOpenProject={(prj) => setSelectedProjectModal(prj)}
                  onRequestSwatches={() => setIsSampleModalOpen(true)}
                />
              )}

              {activeTab === 'story' && <StoryPage storySettings={storySettings} />}

              {activeTab === 'projects' && (
                <ProjectsPage
                  projects={projectsList}
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

              {activeTab === 'brands' && <BrandsPage brands={brandsList} />}

              {activeTab === 'contact' && <ContactPage />}
            </main>

            {/* Global Footer */}
            <Footer
              siteSettings={siteSettings}
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

            {/* Animated Luxury Floating Scroll to Top Button */}
            <ScrollToTop />
          </div>
        </SmoothScrollProvider>
      )}
    </ToastProvider>
  );
}

export default App;
