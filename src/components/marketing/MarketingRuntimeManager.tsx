import React, { useEffect, useMemo } from 'react';
import type { MarketingSettings, CategorySlug, PageSEOConfig } from '../../types';
import { DEFAULT_MARKETING_SETTINGS } from '../../lib/supabase';

interface MarketingRuntimeManagerProps {
  activeTab: string;
  activeCategorySlug?: CategorySlug;
  marketingSettings?: MarketingSettings;
}

// Global declaration for GA and Meta Pixel analytics window objects
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const MarketingRuntimeManager: React.FC<MarketingRuntimeManagerProps> = ({
  activeTab,
  activeCategorySlug,
  marketingSettings = DEFAULT_MARKETING_SETTINGS
}) => {
  // 1. Resolve Active Page SEO Configuration
  const currentSEO: PageSEOConfig = useMemo(() => {
    const pages = marketingSettings?.pagesSEO || DEFAULT_MARKETING_SETTINGS.pagesSEO;
    let targetPageId = activeTab;
    if (activeTab === 'category' || activeTab === 'catalogue') {
      targetPageId = 'catalogue';
    }
    const matched = pages.find((p) => p.pageId === targetPageId);
    return (
      matched ||
      pages.find((p) => p.pageId === 'home') ||
      DEFAULT_MARKETING_SETTINGS.pagesSEO[0]
    );
  }, [activeTab, marketingSettings?.pagesSEO]);

  // Helper: set or create meta tag
  const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Helper: set or create link tag
  const setLinkTag = (rel: string, href: string) => {
    if (!href) return;
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  // --------------------------------------------------------------------------
  // A. Page-wise Dynamic SEO Meta & Social Tags
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!currentSEO) return;

    // Document Title
    document.title = currentSEO.metaTitle || 'Atelier Living | Haute Living & Bespoke Furnishings';

    // Standard Meta Tags
    setMetaTag('name', 'description', currentSEO.metaDescription);
    setMetaTag('name', 'keywords', currentSEO.keywords);

    // Robots Directive
    const robotsContent = `${currentSEO.robotsIndex ? 'index' : 'noindex'}, ${
      currentSEO.robotsFollow ? 'follow' : 'nofollow'
    }`;
    setMetaTag('name', 'robots', robotsContent);

    // Canonical URL
    const canonical = currentSEO.canonicalUrl || window.location.href;
    setLinkTag('canonical', canonical);

    // Open Graph Tags
    setMetaTag('property', 'og:title', currentSEO.ogTitle || currentSEO.metaTitle);
    setMetaTag('property', 'og:description', currentSEO.ogDescription || currentSEO.metaDescription);
    setMetaTag('property', 'og:type', currentSEO.ogType || 'website');
    setMetaTag('property', 'og:url', canonical);
    if (currentSEO.ogImage) {
      setMetaTag('property', 'og:image', currentSEO.ogImage);
    }

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', currentSEO.twitterCard || 'summary_large_image');
    setMetaTag('name', 'twitter:title', currentSEO.twitterTitle || currentSEO.metaTitle);
    setMetaTag('name', 'twitter:description', currentSEO.twitterDescription || currentSEO.metaDescription);
    if (currentSEO.twitterImage || currentSEO.ogImage) {
      setMetaTag('name', 'twitter:image', currentSEO.twitterImage || currentSEO.ogImage || '');
    }

    // Structured Data JSON-LD Schema
    const jsonLdId = 'atelier-structured-data';
    let jsonLdScript = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (currentSEO.structuredDataJson && currentSEO.structuredDataJson.trim() !== '') {
      try {
        // Validate JSON
        JSON.parse(currentSEO.structuredDataJson);
        if (!jsonLdScript) {
          jsonLdScript = document.createElement('script');
          jsonLdScript.id = jsonLdId;
          jsonLdScript.type = 'application/ld+json';
          document.head.appendChild(jsonLdScript);
        }
        jsonLdScript.text = currentSEO.structuredDataJson;
      } catch (err) {
        console.warn('Invalid structuredDataJson format for page:', currentSEO.pageId, err);
      }
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [currentSEO, activeCategorySlug]);

  // --------------------------------------------------------------------------
  // B. Google Webmaster & Search Console Verification
  // --------------------------------------------------------------------------
  useEffect(() => {
    const webmaster = marketingSettings?.webmaster;
    if (!webmaster) return;

    if (webmaster.googleSiteVerification) {
      setMetaTag('name', 'google-site-verification', webmaster.googleSiteVerification);
    }
    if (webmaster.bingSiteVerification) {
      setMetaTag('name', 'msvalidate.01', webmaster.bingSiteVerification);
    }
    if (webmaster.yandexVerification) {
      setMetaTag('name', 'yandex-verification', webmaster.yandexVerification);
    }
    if (webmaster.pinterestVerification) {
      setMetaTag('name', 'p:domain_verify', webmaster.pinterestVerification);
    }
    if (webmaster.baiduVerification) {
      setMetaTag('name', 'baidu-site-verification', webmaster.baiduVerification);
    }
  }, [marketingSettings?.webmaster]);

  // --------------------------------------------------------------------------
  // C. Google Analytics 4 (GA4) & Google Tag Manager (GTM)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const ga = marketingSettings?.googleAnalytics;
    if (!ga || !ga.enabled || !ga.measurementId || ga.measurementId.trim() === '') {
      return;
    }

    const measurementId = ga.measurementId.trim();

    if (ga.type === 'ga4') {
      // 1. Inject gtag.js script if not present
      const scriptId = 'google-analytics-gtag';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer?.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          anonymize_ip: ga.anonymizeIp !== false,
          send_page_view: true
        });
      }

      // Track SPA Route Changes
      if (ga.sendPageViewOnRouteChange && typeof window.gtag === 'function') {
        window.gtag('config', measurementId, {
          page_path: window.location.pathname,
          page_title: document.title
        });
      }
    } else if (ga.type === 'gtm') {
      // Inject Google Tag Manager container
      const gtmScriptId = 'google-tag-manager-container';
      if (!document.getElementById(gtmScriptId)) {
        const script = document.createElement('script');
        script.id = gtmScriptId;
        script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${encodeURIComponent(measurementId)}');`;
        document.head.appendChild(script);
      }

      // Push virtual pageview event for SPA navigation
      if (ga.sendPageViewOnRouteChange && window.dataLayer) {
        window.dataLayer.push({
          event: 'pageview',
          page: window.location.pathname,
          title: document.title
        });
      }
    }
  }, [marketingSettings?.googleAnalytics, activeTab]);

  // --------------------------------------------------------------------------
  // D. Facebook / Meta Pixel
  // --------------------------------------------------------------------------
  useEffect(() => {
    const pixel = marketingSettings?.metaPixel;
    if (!pixel || !pixel.enabled || !pixel.pixelId || pixel.pixelId.trim() === '') {
      return;
    }

    const pixelId = pixel.pixelId.trim();
    const pixelScriptId = 'meta-pixel-init';

    if (!document.getElementById(pixelScriptId)) {
      /* eslint-disable */
      // @ts-ignore
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.id = pixelScriptId;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      if (window.fbq) {
        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
      }
    } else if (pixel.trackPageViewOnRouteChange && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [marketingSettings?.metaPixel, activeTab]);

  // --------------------------------------------------------------------------
  // E. Custom Header & Footer Code Injection
  // --------------------------------------------------------------------------
  useEffect(() => {
    const code = marketingSettings?.codeInjection;
    const headerContainerId = 'atelier-custom-header-injection';
    const footerContainerId = 'atelier-custom-footer-injection';

    // Remove old injection containers
    const existingHeader = document.getElementById(headerContainerId);
    if (existingHeader) existingHeader.remove();

    const existingFooter = document.getElementById(footerContainerId);
    if (existingFooter) existingFooter.remove();

    if (!code || !code.enabled) {
      return;
    }

    // 1. Execute & Inject Header Code in <head>
    if (code.headerCode && code.headerCode.trim() !== '') {
      const headerDiv = document.createElement('div');
      headerDiv.id = headerContainerId;
      headerDiv.style.display = 'none';
      headerDiv.innerHTML = code.headerCode;
      document.head.appendChild(headerDiv);

      // Execute scripts if any exist within the injected HTML
      const scripts = headerDiv.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }

    // 2. Execute & Inject Footer Code before </body>
    if (code.footerCode && code.footerCode.trim() !== '') {
      const footerDiv = document.createElement('div');
      footerDiv.id = footerContainerId;
      footerDiv.style.display = 'none';
      footerDiv.innerHTML = code.footerCode;
      document.body.appendChild(footerDiv);

      // Execute scripts if any exist within footer injected HTML
      const scripts = footerDiv.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }

    return () => {
      const cleanHeader = document.getElementById(headerContainerId);
      if (cleanHeader) cleanHeader.remove();
      const cleanFooter = document.getElementById(footerContainerId);
      if (cleanFooter) cleanFooter.remove();
    };
  }, [marketingSettings?.codeInjection]);

  return null; // Headless runtime manager
};
