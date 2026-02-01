// Component loader for navbar and sidebar with static caching
document.addEventListener("DOMContentLoaded", function() {
  // Load navbar with caching
  const cachedNavbar = sessionStorage.getItem('navbar-html');
  if (cachedNavbar) {
    // Use cached version
    document.getElementById('navbar-placeholder').innerHTML = cachedNavbar;
    initNavbarScript();
  } else {
    // Fetch and cache
    fetch('navbar.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load navbar');
        return response.text();
      })
      .then(text => {
        sessionStorage.setItem('navbar-html', text);
        document.getElementById('navbar-placeholder').innerHTML = text;
        initNavbarScript();
      })
      .catch(error => console.warn('Error loading navbar:', error));
  }

  // Load sidebar with caching
  const cachedSidebar = sessionStorage.getItem('sidebar-html');
  if (cachedSidebar) {
    // Use cached version
    document.getElementById('sidebar-placeholder').innerHTML = cachedSidebar;
  } else {
    // Fetch and cache
    fetch('sidebar.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load sidebar');
        return response.text();
      })
      .then(text => {
        sessionStorage.setItem('sidebar-html', text);
        document.getElementById('sidebar-placeholder').innerHTML = text;
      })
      .catch(error => console.warn('Error loading sidebar:', error));
  }

  function initNavbarScript() {
    // Load navbar JavaScript only if not already loaded
    if (!document.querySelector('script[src="./js/navbar.js"]')) {
      const script = document.createElement('script');
      script.src = './js/navbar.js';
      script.id = 'navbar-script';
      document.body.appendChild(script);
    } else if (window.navbarManager) {
      // Script already loaded, just reinitialize
      window.navbarManager.initialized = false;
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    }
  }
});
