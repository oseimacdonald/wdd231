// navigation.js - Enhanced with active page detection
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navigation = document.querySelector('.navigation');
  
  // Set active navigation item based on current page
  function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.navigation a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      // Remove active class from all links
      link.classList.remove('active');
      
      // Check if this link matches the current page
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
      
      // Special case for index.html (homepage)
      if (currentPage === '' || currentPage === 'index.html' && linkPage === 'index.html') {
        document.querySelector('.navigation a[href="index.html"]').classList.add('active');
      }
    });
  }
  
  // Toggle mobile navigation
  if (hamburger && navigation) {
    hamburger.addEventListener('click', () => {
      navigation.classList.toggle('show');
      hamburger.textContent = navigation.classList.contains('show') ? '✕' : '☰';
      hamburger.setAttribute('aria-expanded', navigation.classList.contains('show'));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navigation.classList.contains('show') && 
          !navigation.contains(e.target) && 
          e.target !== hamburger) {
        navigation.classList.remove('show');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navigation.classList.remove('show');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Handle keyboard navigation
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
      }
    });
  }
  
  // Set active navigation item
  setActiveNavItem();
});