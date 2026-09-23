import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { MarketingRuntimeManager } from './components/marketing/MarketingRuntimeManager';
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
  DEFAULT_HERO_SLIDES,
  DEFAULT_MARKETING_SETTINGS,
  fetchTestimonialsFromSupabase,
  fetchBrandsFromSupabase,
  fetchStorySettingsFromSupabase,
  fetchHeroSlidesFromSupabase,
  fetchMarketingSettingsFromSupabase
} from './lib/supabase';
import { PROJECTS_DATA } from './data/projectsData';
import type {
  CategorySlug,
  Project,
  SiteSettings,
  Testimonial,
  BrandPartner,
  StorySettings,
  FurnishingScene,
  MarketingSettings
} from './types';
import type { AdminUser } from './types/adminTypes';

/**
 * Route parser helper to resolve URL pathname to application tab & category slug
 */
const parseRouteFromLocation = (): { tab: string; categorySlug?: CategorySlug } => {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const lowerPath = pathname.toLowerCase();

  if (lowerPath === '/admin' || lowerPath.startsWith('/admin/')) {
    return { tab: 'admin' };
  }
  if (lowerPath === '/story' || lowerPath === '/our-story' || lowerPath === '/about') {
    return { tab: 'story' };
  }
  if (lowerPath === '/projects' || lowerPath === '/portfolio' || lowerPath === '/our-projects') {
    return { tab: 'projects' };
  }
  if (lowerPath === '/brands' || lowerPath === '/partners' || lowerPath === '/brands-with-us') {
    return { tab: 'brands' };
  }
  if (lowerPath === '/contact' || lowerPath === '/contact-us') {
    return { tab: 'contact' };
  }
  if (lowerPath.startsWith('/category/') || lowerPath.startsWith('/catalogue/')) {
    const parts = lowerPath.split('/');
    const rawSlug = parts[2] || 'fabrics';
    return { tab: 'category', categorySlug: rawSlug as CategorySlug };
  }
  if (lowerPath === '/category' || lowerPath === '/catalogue') {
    return { tab: 'category', categorySlug: 'fabrics' };
  }
  return { tab: 'home' };
};

export function App() {
  const initialRoute = parseRouteFromLocation();
  const [activeTab, setActiveTab] = useState<string>(initialRoute.tab);
  const [activeCategorySlug, setActiveCategorySlug] = useState<CategorySlug>(initialRoute.categorySlug || 'fabrics');
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS_DATA);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [brandsList, setBrandsList] = useState<BrandPartner[]>(DEFAULT_BRANDS_DATA);
  const [storySettings, setStorySettings] = useState<StorySettings>(DEFAULT_STORY_SETTINGS);
  const [heroSlidesList, setHeroSlidesList] = useState<FurnishingScene[]>(DEFAULT_HERO_SLIDES);
  const [marketingSettings, setMarketingSettings] = useState<MarketingSettings>(DEFAULT_MARKETING_SETTINGS);

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

  const loadLiveHeroSlides = async () => {
    try {
      const slides = await fetchHeroSlidesFromSupabase();
      if (slides && slides.length > 0) {
        setHeroSlidesList(slides);
      }
    } catch (err) {
      console.warn('Error loading live hero slides:', err);
    }
  };

  const loadLiveMarketingSettings = async () => {
    try {
      const mkt = await fetchMarketingSettingsFromSupabase();
      if (mkt) {
        setMarketingSettings(mkt);
      }
    } catch (err) {
      console.warn('Error loading live marketing settings:', err);
    }
  };

  const loadAllData = useCallback(() => {
    loadLiveProjects();
    loadLiveSiteSettings();
    loadLiveTestimonials();
    loadLiveBrands();
    loadLiveStorySettings();
    loadLiveHeroSlides();
    loadLiveMarketingSettings();
  }, []);

  // Sync state from location on initial load and restore admin session
  useEffect(() => {
    const route = parseRouteFromLocation();
    setActiveTab(route.tab);
    if (route.categorySlug) {
      setActiveCategorySlug(route.categorySlug);
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
  }, [loadAllData]);

  // Reload data whenever activeTab changes
  useEffect(() => {
    loadAllData();
  }, [activeTab, loadAllData]);

  // Listen to cross-tab / master admin storage updates for projects, site settings, testimonials, brands, story, hero slides, marketing
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
      if (e.key === 'atelier_hero_slides' || e.key === 'atelier_deleted_hero_slides') {
        loadLiveHeroSlides();
      }
      if (e.key === 'atelier_marketing_settings') {
        loadLiveMarketingSettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen to popstate (browser Back / Forward buttons) to seamlessly sync tab & view
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRouteFromLocation();
      setActiveTab(route.tab);
      if (route.categorySlug) {
        setActiveCategorySlug(route.categorySlug);
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
    let targetPath = '/';
    if (tab === 'admin') {
      targetPath = '/admin';
      setActiveTab('admin');
    } else if (tab === 'catalogue' || tab === 'category') {
      const targetSlug = categorySlug || activeCategorySlug || 'fabrics';
      setActiveCategorySlug(targetSlug);
      setActiveTab('category');
      targetPath = `/category/${targetSlug}`;
    } else if (tab === 'home') {
      setActiveTab('home');
      targetPath = '/';
    } else {
      setActiveTab(tab);
      targetPath = `/${tab}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleNavigateToCategory = (catSlug: CategorySlug) => {
    setActiveCategorySlug(catSlug);
    setActiveTab('category');
    const targetPath = `/category/${catSlug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setActiveTab('admin');
    if (window.location.pathname !== '/admin') {
      window.history.pushState({}, '', '/admin');
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('atelier_admin_session');
    localStorage.removeItem('maison_admin_session');
  };

  return (
    <ToastProvider>
      {/* Dynamic SEO, Webmaster, Google Analytics, Pixel & Code Injection Manager */}
      <MarketingRuntimeManager
        activeTab={activeTab}
        activeCategorySlug={activeCategorySlug}
        marketingSettings={marketingSettings}
      />

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
                  heroSlides={heroSlidesList}
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

              {activeTab === 'contact' && <ContactPage siteSettings={siteSettings} />}
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

            {/* Global Floating WhatsApp Concierge Button */}
            <FloatingWhatsApp siteSettings={siteSettings} />

            {/* Animated Luxury Floating Scroll to Top Button */}
            <ScrollToTop siteSettings={siteSettings} />
          </div>
        </SmoothScrollProvider>
      )}
    </ToastProvider>
  );
}

export default App;
