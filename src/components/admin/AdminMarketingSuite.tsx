import React, { useState } from 'react';
import {
  Globe,
  Search,
  Code,
  Share2,
  FileText,
  CheckCircle2,
  Save,
  RotateCcw,
  AlertTriangle,
  Check,
  Copy,
  Activity,
  BarChart3
} from 'lucide-react';
import type {
  MarketingSettings,
  PageSEOConfig,
  WebmasterVerificationSettings,
  GoogleAnalyticsSettings,
  MetaPixelSettings,
  CodeInjectionSettings
} from '../../types';
import { DEFAULT_MARKETING_SETTINGS, DEFAULT_PAGES_SEO, updateMarketingSettingsInSupabase } from '../../lib/supabase';
import { useToast } from '../ui/ToastNotification';

interface AdminMarketingSuiteProps {
  marketingSettings: MarketingSettings;
  onUpdateMarketingSettings: (updated: MarketingSettings) => void;
  adminEmail?: string;
}

export const AdminMarketingSuite: React.FC<AdminMarketingSuiteProps> = ({
  marketingSettings,
  onUpdateMarketingSettings,
  adminEmail = 'admin@atelier-living.com'
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'pages-seo' | 'webmaster' | 'google-analytics' | 'facebook-pixel' | 'code-injection'
  >('pages-seo');

  const [localSettings, setLocalSettings] = useState<MarketingSettings>(marketingSettings || DEFAULT_MARKETING_SETTINGS);
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync if prop updates
  React.useEffect(() => {
    if (marketingSettings) {
      setLocalSettings(marketingSettings);
    }
  }, [marketingSettings]);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast('Copied to Clipboard', `Copied: ${keyName}`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Get active page SEO config
  const currentPageSEO: PageSEOConfig =
    localSettings.pagesSEO.find((p) => p.pageId === selectedPageId) ||
    DEFAULT_PAGES_SEO.find((p) => p.pageId === selectedPageId) ||
    DEFAULT_PAGES_SEO[0];

  // Update specific field in selected page SEO
  const updateCurrentPageSEO = (field: keyof PageSEOConfig, value: any) => {
    const updatedPages = localSettings.pagesSEO.map((p) => {
      if (p.pageId === selectedPageId) {
        return { ...p, [field]: value };
      }
      return p;
    });

    // If page wasn't in array yet, add it
    if (!updatedPages.some((p) => p.pageId === selectedPageId)) {
      updatedPages.push({ ...currentPageSEO, [field]: value });
    }

    setLocalSettings((prev) => ({
      ...prev,
      pagesSEO: updatedPages
    }));
  };

  // Update Webmaster verification settings
  const updateWebmaster = (field: keyof WebmasterVerificationSettings, value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      webmaster: {
        ...prev.webmaster,
        [field]: value
      }
    }));
  };

  // Update Google Analytics settings
  const updateGA = (field: keyof GoogleAnalyticsSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      googleAnalytics: {
        ...prev.googleAnalytics,
        [field]: value
      }
    }));
  };

  // Update Meta Pixel settings
  const updatePixel = (field: keyof MetaPixelSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      metaPixel: {
        ...prev.metaPixel,
        [field]: value
      }
    }));
  };

  // Update Code Injection settings
  const updateCodeInjection = (field: keyof CodeInjectionSettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      codeInjection: {
        ...prev.codeInjection,
        [field]: value
      }
    }));
  };

  // Save All Changes to Supabase + LocalStorage
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateMarketingSettingsInSupabase(localSettings, adminEmail);
      onUpdateMarketingSettings(localSettings);
      showToast(
        'SEO & Marketing Published',
        'All Webmaster verification, SEO meta, Analytics, Pixel, and Code injections are now active live.',
        'success'
      );
    } catch (err) {
      console.error('Error saving marketing settings:', err);
      showToast('Save Failed', 'Could not persist marketing settings. Check network.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Luxury Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all SEO, Analytics, Webmaster, and Code Injection settings to default luxury values?')) {
      setLocalSettings(DEFAULT_MARKETING_SETTINGS);
      updateMarketingSettingsInSupabase(DEFAULT_MARKETING_SETTINGS, adminEmail);
      onUpdateMarketingSettings(DEFAULT_MARKETING_SETTINGS);
      showToast('Settings Reset', 'Marketing & SEO settings restored to luxury defaults.', 'info');
    }
  };

  // Character counter helper
  const getCharMeterClass = (current: number, min: number, max: number) => {
    if (current === 0) return 'text-[#8C9A90]';
    if (current >= min && current <= max) return 'text-emerald-400 font-semibold';
    if (current < min) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ================= HEADER & CONTROL BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#163129] border border-[#C9A56A]/30 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#C9A56A]/15 border border-[#C9A56A]/40 text-[#C9A56A]">
              <Globe className="w-5 h-5 text-[#C9A56A]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              SEO & Webmaster Marketing Suite
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-[#8C9A90]">
            Manage Google Webmaster listings, page-level SEO & Open Graph meta, Google Analytics 4 / GTM, Meta Pixel, and dynamic header/footer code injection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-xs text-[#8C9A90] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to default luxury SEO templates"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A56A] via-[#E6C894] to-[#C9A56A] text-[#0F1714] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {isSaving ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= SUB-NAVIGATION SEGMENTS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {[
          { id: 'pages-seo', label: 'Page-wise SEO & Social Meta', icon: FileText },
          { id: 'webmaster', label: 'Google Webmaster & Verification', icon: Search },
          { id: 'google-analytics', label: 'Google Analytics & GTM', icon: BarChart3 },
          { id: 'facebook-pixel', label: 'Facebook / Meta Pixel', icon: Activity },
          { id: 'code-injection', label: 'Header & Footer Code Injection', icon: Code }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-md'
                  : 'bg-[#163129] text-[#8C9A90] hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F1714]' : 'text-[#C9A56A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: PAGE-WISE SEO & SOCIAL META ================= */}
      {activeTab === 'pages-seo' && (
        <div className="space-y-6">
          {/* Page Selector Tabs */}
          <div className="bg-[#163129] border border-[#C9A56A]/20 p-4 rounded-2xl flex items-center gap-2 overflow-x-auto">
            <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold shrink-0 mr-2">
              Select Page:
            </span>
            {[
              { id: 'home', name: 'Home Showcase', route: '/' },
              { id: 'story', name: 'Our Story', route: '/story' },
              { id: 'projects', name: 'Residence Portfolio', route: '/projects' },
              { id: 'catalogue', name: 'Product Catalogue', route: '/category/fabrics' },
              { id: 'brands', name: 'Brand Partners', route: '/brands' },
              { id: 'contact', name: 'Contact & Atelier', route: '/contact' }
            ].map((p) => {
              const isSelected = selectedPageId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPageId(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C9A56A]/20 border border-[#C9A56A] text-white'
                      : 'bg-white/5 border border-transparent text-[#8C9A90] hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-[#C9A56A] font-mono">({p.route})</span>
                </button>
              );
            })}
          </div>

          {/* Live Google Search Preview (SERP Card) */}
          <div className="p-6 rounded-3xl bg-[#12241E] border border-[#C9A56A]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Google Search Result Live Snippet Preview</span>
              </span>
              <span className="text-[11px] text-[#8C9A90]">SERP Desktop & Mobile Simulation</span>
            </div>

            <div className="bg-[#202124] p-5 rounded-2xl border border-white/10 font-sans space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-xs text-[#BDC1C6]">
                <div className="w-4 h-4 rounded-full bg-[#C9A56A] text-[#0F1714] font-bold text-[9px] flex items-center justify-center">
                  A
                </div>
                <span className="text-[11px] text-[#DADCE0] font-medium">Atelier Living</span>
                <span className="text-[11px] text-[#9AA0A6] font-mono">
                  {currentPageSEO.canonicalUrl || `https://atelier-living.com${currentPageSEO.routePath}`}
                </span>
              </div>
              <h4 className="text-lg text-[#8AB4F8] hover:underline font-medium cursor-pointer line-clamp-1">
                {currentPageSEO.metaTitle || 'Atelier Living | Haute Living, Bespoke Drapes & Luxury Furnishings'}
              </h4>
              <p className="text-xs text-[#BDC1C6] leading-relaxed line-clamp-2">
                {currentPageSEO.metaDescription ||
                  'Discover Atelier Living: bespoke artisanal textiles, couture window treatments, bespoke drapes, wallcoverings, and European master craft furnishings.'}
              </p>
            </div>
          </div>

          {/* Form Fields: Meta Title & Description */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C9A56A]" />
                <span>Search Engine Meta Tags ({currentPageSEO.pageName})</span>
              </h3>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
                    Page Meta Title (Browser & Search Snippet)
                  </label>
                  <span
                    className={`text-[11px] ${getCharMeterClass(
                      currentPageSEO.metaTitle?.length || 0,
                      40,
                      65
                    )}`}
                  >
                    {currentPageSEO.metaTitle?.length || 0} / 60 chars (Recommended: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={currentPageSEO.metaTitle || ''}
                  onChange={(e) => updateCurrentPageSEO('metaTitle', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                  placeholder="Atelier Living | Haute Living, Bespoke Drapes & Luxury Furnishings"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold">
                    Page Meta Description
                  </label>
                  <span
                    className={`text-[11px] ${getCharMeterClass(
                      currentPageSEO.metaDescription?.length || 0,
                      120,
                      160
                    )}`}
                  >
                    {currentPageSEO.metaDescription?.length || 0} / 160 chars (Recommended: 140-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={currentPageSEO.metaDescription || ''}
                  onChange={(e) => updateCurrentPageSEO('metaDescription', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                  placeholder="Enter high-converting search meta description..."
                />
              </div>

              {/* Keywords & Canonical */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                    Focus Keywords (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={currentPageSEO.keywords || ''}
                    onChange={(e) => updateCurrentPageSEO('keywords', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                    placeholder="luxury furnishings, bespoke curtains, acoustic drapes"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                    Canonical URL (Overrides auto URL)
                  </label>
                  <input
                    type="url"
                    value={currentPageSEO.canonicalUrl || ''}
                    onChange={(e) => updateCurrentPageSEO('canonicalUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                    placeholder="https://atelier-living.com/"
                  />
                </div>
              </div>

              {/* Robots Directives */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <label className="flex items-center space-x-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={currentPageSEO.robotsIndex !== false}
                    onChange={(e) => updateCurrentPageSEO('robotsIndex', e.target.checked)}
                    className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <span>Allow Search Engines to Index (index)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={currentPageSEO.robotsFollow !== false}
                    onChange={(e) => updateCurrentPageSEO('robotsFollow', e.target.checked)}
                    className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                  />
                  <span>Allow Search Engines to Follow Links (follow)</span>
                </label>
              </div>
            </div>

            {/* Social Share & Open Graph (OG) / Twitter Cards */}
            <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#C9A56A]" />
                <span>Open Graph (Facebook, WhatsApp, LinkedIn) & Twitter / X Cards</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                    Open Graph Title (og:title)
                  </label>
                  <input
                    type="text"
                    value={currentPageSEO.ogTitle || ''}
                    onChange={(e) => updateCurrentPageSEO('ogTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                    placeholder="Defaults to Meta Title if empty"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                    Open Graph Type (og:type)
                  </label>
                  <select
                    value={currentPageSEO.ogType || 'website'}
                    onChange={(e) => updateCurrentPageSEO('ogType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0F1714] border border-white/15 focus:border-[#C9A56A] text-sm text-white focus:outline-none"
                  >
                    <option value="website">website</option>
                    <option value="article">article</option>
                    <option value="product">product</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                  Open Graph Description (og:description)
                </label>
                <textarea
                  rows={2}
                  value={currentPageSEO.ogDescription || ''}
                  onChange={(e) => updateCurrentPageSEO('ogDescription', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                  placeholder="Defaults to Meta Description if empty"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                  Social Sharing Preview Image URL (og:image / twitter:image)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentPageSEO.ogImage || ''}
                    onChange={(e) => {
                      updateCurrentPageSEO('ogImage', e.target.value);
                      updateCurrentPageSEO('twitterImage', e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
                {currentPageSEO.ogImage && (
                  <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                      src={currentPageSEO.ogImage}
                      alt="Social share preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* JSON-LD Structured Data Schema */}
            <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#C9A56A]" />
                  <span>JSON-LD Structured Data Schema (schema.org)</span>
                </h3>
                <span className="text-[11px] text-[#C9A56A] font-mono">application/ld+json</span>
              </div>
              <p className="text-xs text-[#8C9A90]">
                Add rich structured snippet schema for Google Knowledge Graph, Local Business details, or Product catalogs.
              </p>
              <textarea
                rows={6}
                value={currentPageSEO.structuredDataJson || ''}
                onChange={(e) => updateCurrentPageSEO('structuredDataJson', e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B120F] border border-white/15 focus:border-[#C9A56A] text-xs font-mono text-emerald-300 placeholder-white/20 focus:outline-none leading-relaxed"
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "HomeGoodsStore",\n  "name": "Atelier Living"\n}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: GOOGLE WEBMASTER & VERIFICATION ================= */}
      {activeTab === 'webmaster' && (
        <div className="space-y-6">
          <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C9A56A]" />
                <span>Search Engine Ownership & Webmaster Verification</span>
              </h3>
              <p className="text-xs text-[#8C9A90]">
                Paste your verification tokens or meta tags below. The website will automatically inject the corresponding &lt;meta&gt; tags into the HTML &lt;head&gt;.
              </p>
            </div>

            {/* Google Search Console */}
            <div className="p-5 rounded-2xl bg-[#0F1714] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-2">
                  <span>Google Search Console Verification Token</span>
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">name="google-site-verification"</span>
              </div>
              <input
                type="text"
                value={localSettings.webmaster.googleSiteVerification || ''}
                onChange={(e) => updateWebmaster('googleSiteVerification', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none font-mono"
                placeholder="e.g. 7qX_abc123XYZ456..."
              />
              <span className="text-[11px] text-[#8C9A90] block">
                Find this in Google Search Console &rarr; Settings &rarr; Ownership verification &rarr; HTML tag. Paste just the content token or full code.
              </span>
            </div>

            {/* Bing Webmaster Tools */}
            <div className="p-5 rounded-2xl bg-[#0F1714] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold flex items-center gap-2">
                  <span>Bing & Yahoo Webmaster Verification Code</span>
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">name="msvalidate.01"</span>
              </div>
              <input
                type="text"
                value={localSettings.webmaster.bingSiteVerification || ''}
                onChange={(e) => updateWebmaster('bingSiteVerification', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none font-mono"
                placeholder="e.g. 8A5B94254E7F..."
              />
            </div>

            {/* Yandex & Pinterest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0F1714] border border-white/10 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold block">
                  Yandex Verification (yandex-verification)
                </label>
                <input
                  type="text"
                  value={localSettings.webmaster.yandexVerification || ''}
                  onChange={(e) => updateWebmaster('yandexVerification', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none font-mono"
                  placeholder="e.g. 5d7e3f89a1..."
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1714] border border-white/10 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold block">
                  Pinterest Domain Verification (p:domain_verify)
                </label>
                <input
                  type="text"
                  value={localSettings.webmaster.pinterestVerification || ''}
                  onChange={(e) => updateWebmaster('pinterestVerification', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white placeholder-white/30 focus:outline-none font-mono"
                  placeholder="e.g. 4e26210f8..."
                />
              </div>
            </div>

            {/* Robots.txt Content Editor */}
            <div className="p-5 rounded-2xl bg-[#0F1714] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold">
                  Robots.txt Content
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">/robots.txt</span>
              </div>
              <textarea
                rows={4}
                value={localSettings.webmaster.robotsTxtContent || ''}
                onChange={(e) => updateWebmaster('robotsTxtContent', e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B120F] border border-white/15 focus:border-[#C9A56A] text-xs font-mono text-emerald-300 placeholder-white/30 focus:outline-none leading-relaxed"
                placeholder="User-agent: *\nAllow: /\nDisallow: /admin"
              />
            </div>

            {/* Sitemap Link Card */}
            <div className="p-4 rounded-2xl bg-[#C9A56A]/10 border border-[#C9A56A]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A56A] shrink-0" />
                <div>
                  <strong className="text-white block">XML Sitemap Endpoint Ready:</strong>
                  <span className="font-mono text-[11px] text-[#E9DFD1]">
                    {localSettings.webmaster.sitemapUrl || 'https://atelier-living.com/sitemap.xml'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    localSettings.webmaster.sitemapUrl || 'https://atelier-living.com/sitemap.xml',
                    'Sitemap URL'
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#C9A56A] text-[#0F1714] font-bold text-[11px] uppercase tracking-wider hover:bg-[#E6C894] transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                {copiedKey === 'Sitemap URL' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'Sitemap URL' ? 'Copied' : 'Copy Sitemap URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GOOGLE ANALYTICS & GTM ================= */}
      {activeTab === 'google-analytics' && (
        <div className="space-y-6">
          <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#C9A56A]" />
                  <span>Google Analytics 4 (GA4) & Google Tag Manager (GTM)</span>
                </h3>
                <p className="text-xs text-[#8C9A90]">
                  Track luxury visitor engagement, bounce rates, residence gallery views, and conversion milestones.
                </p>
              </div>

              {/* Master Active Toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.googleAnalytics.enabled}
                  onChange={(e) => updateGA('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-xs font-bold uppercase tracking-wider text-white">
                  {localSettings.googleAnalytics.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Tracking Mode: GA4 vs GTM */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-2">
                Measurement Integration Engine
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateGA('type', 'ga4')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    localSettings.googleAnalytics.type === 'ga4'
                      ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#8C9A90] hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">Google Analytics 4 (gtag.js)</div>
                  <div className="text-xs text-[#8C9A90]">
                    Direct connection using your GA4 Measurement ID (e.g. <code>G-XXXXXXXXXX</code>).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateGA('type', 'gtm')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    localSettings.googleAnalytics.type === 'gtm'
                      ? 'bg-[#C9A56A]/20 border-[#C9A56A] text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#8C9A90] hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-sm text-white mb-1">Google Tag Manager (GTM)</div>
                  <div className="text-xs text-[#8C9A90]">
                    Enterprise container using your GTM Container ID (e.g. <code>GTM-XXXXXXX</code>).
                  </div>
                </button>
              </div>
            </div>

            {/* Measurement / Container ID */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                {localSettings.googleAnalytics.type === 'ga4'
                  ? 'GA4 Measurement ID (G-XXXXXXXXXX)'
                  : 'GTM Container ID (GTM-XXXXXXX)'}
              </label>
              <input
                type="text"
                value={localSettings.googleAnalytics.measurementId || ''}
                onChange={(e) => updateGA('measurementId', e.target.value.trim())}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white font-mono placeholder-white/30 focus:outline-none"
                placeholder={localSettings.googleAnalytics.type === 'ga4' ? 'G-ABC123XYZ0' : 'GTM-K9L8M7N'}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-2.5 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.googleAnalytics.sendPageViewOnRouteChange !== false}
                  onChange={(e) => updateGA('sendPageViewOnRouteChange', e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                />
                <span>Automatically track virtual pageviews on Single-Page Application (SPA) route changes</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.googleAnalytics.anonymizeIp !== false}
                  onChange={(e) => updateGA('anonymizeIp', e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                />
                <span>Anonymize Client IP (GDPR / Privacy Compliance)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FACEBOOK / META PIXEL ================= */}
      {activeTab === 'facebook-pixel' && (
        <div className="space-y-6">
          <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C9A56A]" />
                  <span>Meta / Facebook Pixel Integration</span>
                </h3>
                <p className="text-xs text-[#8C9A90]">
                  Track conversions, build custom luxury audiences, and optimize Meta Ads campaigns.
                </p>
              </div>

              {/* Master Active Toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.metaPixel.enabled}
                  onChange={(e) => updatePixel('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-xs font-bold uppercase tracking-wider text-white">
                  {localSettings.metaPixel.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Meta Pixel ID */}
            <div>
              <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-semibold block mb-1.5">
                Meta Pixel ID (15-16 Digit Number)
              </label>
              <input
                type="text"
                value={localSettings.metaPixel.pixelId || ''}
                onChange={(e) => updatePixel('pixelId', e.target.value.trim())}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#C9A56A] text-sm text-white font-mono placeholder-white/30 focus:outline-none"
                placeholder="e.g. 1234567890123456"
              />
              <span className="text-[11px] text-[#8C9A90] mt-1.5 block">
                Find your Pixel ID in Meta Events Manager &rarr; Data Sources &rarr; Settings.
              </span>
            </div>

            {/* Tracking Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-2.5 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.metaPixel.trackPageViewOnRouteChange !== false}
                  onChange={(e) => updatePixel('trackPageViewOnRouteChange', e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                />
                <span>Automatically trigger <code>fbq('track', 'PageView')</code> on SPA page transitions</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.metaPixel.trackCustomEvents !== false}
                  onChange={(e) => updatePixel('trackCustomEvents', e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A56A] focus:ring-[#C9A56A]"
                />
                <span>Track Swatch Request and Contact Inquiries as <code>Lead</code> conversion events</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CUSTOM HEADER & FOOTER CODE INJECTION ================= */}
      {activeTab === 'code-injection' && (
        <div className="space-y-6">
          <div className="bg-[#163129] border border-[#C9A56A]/20 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#C9A56A]" />
                  <span>Custom Header & Footer Code Injection</span>
                </h3>
                <p className="text-xs text-[#8C9A90]">
                  Inject custom CSS styling, external fonts, third-party tracking scripts, or live chat widgets into your website without modifying source code.
                </p>
              </div>

              {/* Master Active Toggle */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={localSettings.codeInjection.enabled}
                  onChange={(e) => updateCodeInjection('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-3 text-xs font-bold uppercase tracking-wider text-white">
                  {localSettings.codeInjection.enabled ? 'Injection Active' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Alert / Warning */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Developer Note:</strong> Code placed here executes directly in visitor browsers. Ensure scripts are from trusted luxury providers (e.g. Intercom, Tawk.to, Microsoft Clarity, Typekit).
              </span>
            </div>

            {/* 1. Header Code (<head>) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold">
                  Header Code Injection (Injected inside &lt;head&gt;)
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">&lt;head&gt;...&lt;/head&gt;</span>
              </div>
              <p className="text-[11px] text-[#8C9A90]">
                Use for &lt;style&gt;, custom font &lt;link&gt; tags, verification &lt;meta&gt;, or preconnect scripts.
              </p>
              <textarea
                rows={5}
                value={localSettings.codeInjection.headerCode || ''}
                onChange={(e) => updateCodeInjection('headerCode', e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B120F] border border-white/15 focus:border-[#C9A56A] text-xs font-mono text-emerald-300 placeholder-white/30 focus:outline-none leading-relaxed"
                placeholder="<!-- Custom Head Scripts or <style> tags -->"
              />
            </div>

            {/* 2. Top of Body Code (<body> start) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold">
                  Top of Body Injection (Immediately after &lt;body&gt;)
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">&lt;body&gt; [here]</span>
              </div>
              <p className="text-[11px] text-[#8C9A90]">
                Ideal for GTM &lt;noscript&gt; fallback containers or accessibility tags.
              </p>
              <textarea
                rows={3}
                value={localSettings.codeInjection.bodyOpenCode || ''}
                onChange={(e) => updateCodeInjection('bodyOpenCode', e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B120F] border border-white/15 focus:border-[#C9A56A] text-xs font-mono text-emerald-300 placeholder-white/30 focus:outline-none leading-relaxed"
                placeholder="<!-- GTM <noscript> or top-of-body scripts -->"
              />
            </div>

            {/* 3. Footer Code (</body> bottom) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#C9A56A] font-bold">
                  Footer Code Injection (Before closing &lt;/body&gt;)
                </label>
                <span className="text-[11px] text-[#8C9A90] font-mono">[here] &lt;/body&gt;</span>
              </div>
              <p className="text-[11px] text-[#8C9A90]">
                Ideal for live chat widgets (Tawk.to, Zendesk, Intercom, WhatsApp script) and conversion pixels.
              </p>
              <textarea
                rows={5}
                value={localSettings.codeInjection.footerCode || ''}
                onChange={(e) => updateCodeInjection('footerCode', e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0B120F] border border-white/15 focus:border-[#C9A56A] text-xs font-mono text-emerald-300 placeholder-white/30 focus:outline-none leading-relaxed"
                placeholder="<!-- Live chat scripts or conversion counters -->"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
