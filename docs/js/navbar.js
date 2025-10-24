// Navbar Hamburger Menu Functionality
(function() {
  // Prevent multiple initializations
  if (window.navbarInitialized) {
    return;
  }
  window.navbarInitialized = true;

  let closeMenuHandler = null;

  function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');

    if (!hamburger || !navMenu) {
      return;
    }

    // Clean up any existing state
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');

    // Remove old click outside handler if it exists
    if (closeMenuHandler) {
      document.removeEventListener('click', closeMenuHandler);
    }

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const isActive = hamburger.classList.contains('active');

      if (isActive) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      } else {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside (with proper event handling)
    closeMenuHandler = function(event) {
      // Don't close if clicking hamburger or menu
      if (hamburger.contains(event.target) || navMenu.contains(event.target)) {
        return;
      }

      // Only close if menu is actually open
      if (hamburger.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    };

    // Use setTimeout to prevent immediate triggering
    setTimeout(function() {
      document.addEventListener('click', closeMenuHandler);
    }, 100);
  }

  // Handle browser back/forward button
  window.addEventListener('pageshow', function(event) {
    // Reset initialization flag if coming from cache
    if (event.persisted) {
      window.navbarInitialized = false;
      initNavbar();
      window.navbarInitialized = true;
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
