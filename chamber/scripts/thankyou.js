// Thank You Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Display form data
    displayFormData(urlParams);
    
    // Set current year and last modified date
    setFooterInfo();
    
    // Initialize navigation
    initNavigation();
});

function displayFormData(urlParams) {
    // Required fields to display
    const fields = [
        { param: 'firstName', elementId: 'summary-firstName', label: 'First Name' },
        { param: 'lastName', elementId: 'summary-lastName', label: 'Last Name' },
        { param: 'email', elementId: 'summary-email', label: 'Email' },
        { param: 'phone', elementId: 'summary-phone', label: 'Phone' },
        { param: 'businessName', elementId: 'summary-businessName', label: 'Business Name' },
        { param: 'membershipLevel', elementId: 'summary-membershipLevel', label: 'Membership Level' },
        { param: 'timestamp', elementId: 'summary-timestamp', label: 'Application Date' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.elementId);
        if (element) {
            let value = urlParams.get(field.param);
            
            if (field.param === 'timestamp') {
                // Format timestamp
                value = value ? formatTimestamp(value) : 'Not provided';
            } else if (field.param === 'membershipLevel') {
                // Format membership level for display
                value = formatMembershipLevel(value);
            } else {
                value = value || 'Not provided';
            }
            
            element.textContent = value;
        }
    });
}

// Add error handling for missing parameters
function displayFormData(urlParams) {
    const fields = [
        { param: 'firstName', elementId: 'summary-firstName' },
        { param: 'lastName', elementId: 'summary-lastName' },
        { param: 'email', elementId: 'summary-email' },
        { param: 'phone', elementId: 'summary-phone' },
        { param: 'businessName', elementId: 'summary-businessName' },
        { param: 'membershipLevel', elementId: 'summary-membershipLevel' },
        { param: 'timestamp', elementId: 'summary-timestamp' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.elementId);
        if (element) {
            let value = urlParams.get(field.param);
            if (!value) {
                value = 'Not provided';
                element.style.color = '#999';
            }
            element.textContent = value;
        }
    });
}

function formatTimestamp(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

function formatMembershipLevel(level) {
    const levelMap = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    
    return levelMap[level] || level || 'Not specified';
}

function setFooterInfo() {
    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Set last modified date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

function initNavigation() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navigation = document.querySelector('.navigation');
    
    if (hamburger && navigation) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active')
            navigation.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navigation a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navigation.classList.contains('active')) {
                navigation.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Reset navigation on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Ensure navigation is visible and horizontal on desktop
            navigation.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate benefits items on scroll
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    benefitItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// scripts/date.js - Safe version that checks for element existence
document.addEventListener('DOMContentLoaded', function() {
    // Set current year - works with multiple element IDs
    const yearElements = [
        document.getElementById('currentYear'),
        document.getElementById('year')
    ];
    
    yearElements.forEach(element => {
        if (element) {
            element.textContent = new Date().getFullYear();
        }
    });
    
    // Set last modified date - works with multiple element IDs
    const lastModifiedElements = [
        document.getElementById('lastModified'),
        document.getElementById('lastModifiedDate')
    ];
    
    lastModifiedElements.forEach(element => {
        if (element) {
            element.textContent = document.lastModified;
        }
    });
});

// Utility function for formatting dates
function formatDate(dateString) {
    if (!dateString) return 'Not provided';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid date';
    }
}

// Make available globally
window.formatDate = formatDate;