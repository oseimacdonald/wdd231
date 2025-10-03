// navigation.js - Enhanced with mobile-only hamburger functionality
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
   * Check if we're in mobile view
   */
  function isMobileView() {
    return window.innerWidth <= 768;
  }

  /**
   * Toggle mobile navigation menu
   */
  function toggleNavigation() {
    if (!isMobileView()) return;
    
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isExpanded));
    hamburger.classList.toggle('active');
    navigation.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navigation.classList.contains('active') ? 'hidden' : '';
  }

  /**
   * Close mobile navigation menu
   */
  function closeNavigation() {
    if (!isMobileView()) return;
    
    navigation.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (!isMobileView()) {
      // Always ensure navigation is visible on desktop
      navigation.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Initialize navigation
  function initNavigation() {
    // Only add hamburger events if we're in mobile view or the element exists
    if (hamburger && navigation) {
      // Check if we should initialize hamburger functionality
      if (isMobileView()) {
        hamburger.addEventListener('click', toggleNavigation);
        
        // Support keyboard interaction (Enter or Space)
        hamburger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleNavigation();
          }
        });
      }
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobileView() && navigation.classList.contains('active')) {
          closeNavigation();
        }
      });
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
  }

  // Initialize everything
  setActiveNavItem();
  initNavigation();
});