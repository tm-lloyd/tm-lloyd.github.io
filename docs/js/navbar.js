// Navbar Hamburger Menu Functionality
(function() {
  'use strict';

  // Store references globally to manage cleanup
  if (!window.navbarManager) {
    window.navbarManager = {
      hamburgerClickHandler: null,
      closeMenuHandler: null,
      linkClickHandlers: [],
      initialized: false
    };
  }

  function cleanupNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');

    if (!hamburger || !navMenu) {
      return;
    }

    // Remove all event listeners
    if (window.navbarManager.hamburgerClickHandler) {
      hamburger.removeEventListener('click', window.navbarManager.hamburgerClickHandler);
    }

    if (window.navbarManager.closeMenuHandler) {
      document.removeEventListener('click', window.navbarManager.closeMenuHandler);
    }

    // Remove link click handlers
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link, index) => {
      if (window.navbarManager.linkClickHandlers[index]) {
        link.removeEventListener('click', window.navbarManager.linkClickHandlers[index]);
      }
    });

    // Reset state
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');

    // Clear handlers array
    window.navbarManager.linkClickHandlers = [];
  }

  function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');

    if (!hamburger || !navMenu) {
      return;
    }

    // Clean up first to prevent duplicate listeners
    cleanupNavbar();

    // Hamburger click handler
    window.navbarManager.hamburgerClickHandler = function(e) {
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
    };

    hamburger.addEventListener('click', window.navbarManager.hamburgerClickHandler);

    // Link click handlers
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link, index) => {
      const handler = function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      };

      window.navbarManager.linkClickHandlers[index] = handler;
      link.addEventListener('click', handler);
    });

    // Close menu when clicking outside
    window.navbarManager.closeMenuHandler = function(event) {
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

    // Delay to prevent immediate triggering
    setTimeout(function() {
      document.addEventListener('click', window.navbarManager.closeMenuHandler);
    }, 150);

    window.navbarManager.initialized = true;
  }

  // Handle browser back/forward button - critical for bfcache
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      // Page was loaded from cache, reinitialize completely
      setTimeout(function() {
        cleanupNavbar();
        initNavbar();
      }, 50);
    }
  });

  // Handle before unload to cleanup
  window.addEventListener('pagehide', function() {
    cleanupNavbar();
  });

  // Initialize only once when script loads
  if (!window.navbarManager.initialized) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
      initNavbar();
    }
  }
})();
