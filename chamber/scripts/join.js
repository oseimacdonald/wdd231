// join.js - Join page specific functionality only
function initPageScripts() {
    // Membership view toggle functionality
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    const membershipContainer = document.getElementById('membershipContainer');

    if (gridBtn && listBtn && membershipContainer) {
        membershipContainer.className = 'grid';

        gridBtn.addEventListener('click', function() {
            membershipContainer.className = 'grid';
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', function() {
            membershipContainer.className = 'list';
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }

    // Modal functionality for membership levels
    const learnMoreButtons = document.querySelectorAll('.learn-more');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'flex';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });
    });

    // Form timestamp
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Form validation
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let valid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#e53e3e';
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });

            if (!valid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    }

    // Real-time form field validation
    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '#38a169';
            }
        });
    });

    // Footer information
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

// Initialize join page scripts
document.addEventListener('DOMContentLoaded', () => {
    initPageScripts();
});

// Re-run page scripts on pageshow (e.g. back/forward cache restore)
window.addEventListener('pageshow', () => {
    initPageScripts();
});