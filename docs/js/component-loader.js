// Loads the shared navbar/sidebar components.
// This script is placed right after the placeholders (not at the end of <body>) and
// runs synchronously. On a warm sessionStorage cache the markup is injected BEFORE the
// first paint, so navigating between pages shows no flash of an empty navbar/sidebar.
// The first page load of a session still fetches once and populates the cache.
(function() {
  const COMPONENT_CACHE_VERSION = '2026-09-04-3';

  loadComponent({
    key: 'navbar',
    url: 'navbar.html',
    placeholderId: 'navbar-placeholder',
    onLoad: ensureNavbarScript
  });

  loadComponent({
    key: 'sidebar',
    url: 'sidebar.html',
    placeholderId: 'sidebar-placeholder'
  });

  function loadComponent({ key, url, placeholderId, onLoad }) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    const cacheKey = `component:${key}:${COMPONENT_CACHE_VERSION}`;
    const cachedHtml = getCachedComponent(cacheKey);

    // Cache hit: inject synchronously (before paint) so navigation is flicker-free.
    if (cachedHtml) {
      placeholder.innerHTML = cachedHtml;
      if (onLoad) onLoad();
      return;
    }

    // Cache miss (first page of the session): fetch once, then reuse for later pages.
    fetch(url)
      .then(function(response) {
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return response.text();
      })
      .then(function(html) {
        setCachedComponent(cacheKey, html);
        placeholder.innerHTML = html;
        if (onLoad) onLoad();
      })
      .catch(function(error) {
        console.warn(`Error loading ${key}:`, error);
      });
  }

  function ensureNavbarScript() {
    if (window.navbarManager && typeof window.navbarManager.init === 'function') {
      window.navbarManager.init();
      return;
    }

    if (document.getElementById('navbar-script')) return;

    const script = document.createElement('script');
    script.src = './js/navbar.js';
    script.id = 'navbar-script';
    document.body.appendChild(script);
  }

  function getCachedComponent(cacheKey) {
    try {
      return window.sessionStorage.getItem(cacheKey);
    } catch (error) {
      return null;
    }
  }

  function setCachedComponent(cacheKey, html) {
    try {
      window.sessionStorage.setItem(cacheKey, html);
    } catch (error) {
      // Component caching is an optimization; rendering must still work when storage is blocked.
    }
  }
})();
