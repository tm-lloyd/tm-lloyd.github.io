(function() {
  'use strict';

  const manager = window.navbarManager || {};

  manager.cleanup = function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');

    if (!hamburger || !navMenu) return;

    if (manager.hamburgerClickHandler) {
      hamburger.removeEventListener('click', manager.hamburgerClickHandler);
    }

    if (manager.closeMenuHandler) {
      document.removeEventListener('click', manager.closeMenuHandler);
    }

    if (manager.resizeHandler) {
      window.removeEventListener('resize', manager.resizeHandler);
    }

    manager.linkClickHandlers = manager.linkClickHandlers || [];
    navMenu.querySelectorAll('a').forEach(function(link, index) {
      const handler = manager.linkClickHandlers[index];
      if (handler) link.removeEventListener('click', handler);
    });

    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    manager.linkClickHandlers = [];
    manager.initialized = false;
  };

  manager.init = function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');

    if (!hamburger || !navMenu) return;

    manager.cleanup();

    manager.hamburgerClickHandler = function(event) {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', manager.hamburgerClickHandler);

    manager.linkClickHandlers = [];
    navMenu.querySelectorAll('a').forEach(function(link, index) {
      const handler = closeMenu;
      manager.linkClickHandlers[index] = handler;
      link.addEventListener('click', handler);
    });

    manager.closeMenuHandler = function(event) {
      if (hamburger.contains(event.target) || navMenu.contains(event.target)) return;
      closeMenu();
    };

    document.addEventListener('click', manager.closeMenuHandler);

    manager.resizeHandler = function() {
      if (window.matchMedia('(min-width: 48rem)').matches) closeMenu();
    };
    window.addEventListener('resize', manager.resizeHandler);

    manager.initialized = true;

    function closeMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  window.navbarManager = manager;

  window.addEventListener('pageshow', function(event) {
    if (event.persisted) manager.init();
  });

  window.addEventListener('pagehide', function() {
    manager.cleanup();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', manager.init);
  } else {
    manager.init();
  }
})();
