document.addEventListener('DOMContentLoaded', function() {
  const COMPONENT_CACHE_VERSION = '2026-05-11';

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

    if (cachedHtml) {
      placeholder.innerHTML = cachedHtml;
      if (onLoad) onLoad();
      return;
    }

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
});
