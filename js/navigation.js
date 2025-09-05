// Toggle mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    
    hamburger.addEventListener('click', () => {
        navigation.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close navigation when a link is clicked (for mobile)
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navigation.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Close navigation when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && 
            navigation.classList.contains('active') &&
            !e.target.closest('.navigation') && 
            !e.target.closest('.hamburger')) {
            navigation.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});
