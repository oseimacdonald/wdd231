// Toggle mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    
    hamburger.addEventListener('click', () => {
        navigation.classList.toggle('active');
    });
    
    // Close navigation when a link is clicked (for mobile)
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navigation.classList.remove('active');
            }
        });
    });
});
