// navigation.js - Enhanced with active page detection and responsive navigation
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navigation = document.querySelector('.navigation');
  const navLinks = document.querySelectorAll('.navigation a');

  /**
   * Set the active navigation link based on current page
   */
  function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      link.classList.remove('active');

      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Toggle mobile navigation menu
   */
  function toggleNavigation() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isExpanded));
    hamburger.classList.toggle('active');
    navigation.classList.toggle('active');
  }

  /**
   * Close mobile navigation menu
   */
  function closeNavigation() {
    navigation.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  // Hamburger click event
  if (hamburger && navigation) {
    hamburger.addEventListener('click', toggleNavigation);

    // Support keyboard interaction (Enter or Space)
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleNavigation();
      }
    });
  }

  // Close mobile menu when a nav link is clicked (on small screens)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navigation.classList.contains('active')) {
        closeNavigation();
      }
    });
  });

  // Ensure mobile nav is closed when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeNavigation();
    }
  });

  // Set the active navigation item on page load
  setActiveNavItem();
});
