// Component loader for navbar and sidebar
document.addEventListener("DOMContentLoaded", function() {
  fetch('navbar.html')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load navbar');
      return response.text();
    })
    .then(text => {
      document.getElementById('navbar-placeholder').innerHTML = text;

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
    })
    .catch(error => console.warn('Error loading navbar:', error));

  fetch('sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load sidebar');
      return response.text();
    })
    .then(text => document.getElementById('sidebar-placeholder').innerHTML = text)
    .catch(error => console.warn('Error loading sidebar:', error));
});
