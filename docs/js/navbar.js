// Navbar Hamburger Menu Functionality
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('#navbar');

  if (hamburger && navMenu) {
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
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

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
