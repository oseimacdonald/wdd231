// Toggle mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    
    hamburger.addEventListener('click', () => {
        const isExpanded = navigation.classList.toggle('show');
        hamburger.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close navigation when a link is clicked (for mobile)
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navigation.classList.remove('show');
                hamburger.classList.remove('show');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close navigation when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && 
            navigation.classList.contains('show') &&
            !e.target.closest('.navigation') && 
            !e.target.closest('.hamburger')) {
            navigation.classList.remove('show');
            hamburger.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});
