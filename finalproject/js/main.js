// js/main.js

// Import modules
import { displayFeaturedRooms, displayAllRooms, displayAmenitiesPreview, displayAmenities } from './modules/api.js';
import { setupModal, showModal } from './modules/modal.js';
import { saveBookingPreferences, getBookingPreferences } from './modules/storage.js';
import { initializeBookingForms, displayFormData } from './modules/booking.js';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Image handling configuration
const imageConfig = {
    placeholder: 'images/placeholder-image.jpg',
    loading: 'lazy',
    sizes: {
        small: '(max-width: 768px) 100vw',
        medium: '(max-width: 1200px) 50vw',
        large: '33vw'
    },
    altText: {
        rooms: 'Hotel room accommodation',
        amenities: 'Hotel facility and service'
    }
};

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeImageHandling();
    initializeBookingForms();
    setupModal();
    setMinimumDates();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'rooms.html':
            initializeRoomsPage();
            break;
        case 'amenities.html':
            initializeAmenitiesPage();
            break;
        case 'form-action.html':
            initializeFormActionPage();
            break;
        case 'attributions.html':
            initializeAttributionsPage();
            break;
    }
});

// Navigation functionality
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

// Image handling initialization
function initializeImageHandling() {
    setupLazyLoading();
    setupImageErrorHandling();
    optimizeImageLoading();
}

// Setup lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    } else {
        setupIntersectionObserver();
    }
}

// Intersection Observer for lazy loading fallback
function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Handle image loading errors
function setupImageErrorHandling() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            console.warn(`Image failed to load: ${img.src}`);
            img.alt = 'Image not available';
            img.classList.add('image-error');
        }
    }, true);
}

// Optimize image loading based on viewport
function optimizeImageLoading() {
    const responsiveImages = document.querySelectorAll('img[data-srcset]');
    
    responsiveImages.forEach(img => {
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }
        if (img.dataset.sizes) {
            img.sizes = img.dataset.sizes;
        }
    });
}

// Home page initialization
function initializeHomePage() {
    displayFeaturedRooms();
    displayAmenitiesPreview();
    loadSavedPreferences();
    populateTimeOptions();
    setupStickyBooking();
    setupTabFunctionality();
    setupHeroImage();
}

// Rooms page initialization
function initializeRoomsPage() {
    displayAllRooms();
    loadSavedPreferences();
    setupStickyBookingBar();
    setupRoomsModal();
    setupRoomsForm();
    setupRoomGallery();
}

// Amenities page initialization
function initializeAmenitiesPage() {
    displayAmenities();
    loadSavedPreferences();
    populateTimeOptions();
    setupAmenitiesNavigation();
    setupAmenitiesGallery();
}

// Form action page initialization
function initializeFormActionPage() {
    displayFormData();
}

// Attributions page initialization
function initializeAttributionsPage() {
    console.log('Attributions page initialized');
}

// Setup hero image for home page
function setupHeroImage() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const heroImage = heroSection.querySelector('img');
    if (heroImage) {
        heroImage.loading = 'eager';
        heroImage.addEventListener('error', () => {
            heroImage.src = imageConfig.placeholder;
            heroImage.alt = 'Hotel exterior';
        });
    }
}

// Setup room gallery functionality
function setupRoomGallery() {
    const galleryContainers = document.querySelectorAll('.room-gallery');
    
    galleryContainers.forEach(container => {
        const images = container.querySelectorAll('img');
        
        images.forEach((img) => {
            img.addEventListener('click', () => {
                openImageModal(img.src, img.alt);
            });
            
            img.setAttribute('tabindex', '0');
            img.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openImageModal(img.src, img.alt);
                }
            });
        });
    });
}

// Setup amenities gallery functionality
function setupAmenitiesGallery() {
    const amenityItems = document.querySelectorAll('.amenity-item');
    
    amenityItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
            
            img.addEventListener('click', () => {
                openImageModal(img.src, img.alt);
            });
        }
    });
}

// Open image modal for larger view
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: zoom-out;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 10001;
    `;
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    const closeModal = () => {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
    };
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', handleEscape);
    
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', closeModal);
}

// Tab functionality for booking forms
function setupTabFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                const targetTab = document.getElementById(`${tabId}-tab`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }
}

// Sticky booking overlay behavior
function setupStickyBooking() {
    const bookingOverlay = document.getElementById('bookingOverlay');
    if (bookingOverlay) {
        window.addEventListener('scroll', () => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (window.scrollY > heroBottom - 100) {
                    bookingOverlay.classList.add('sticky');
                } else {
                    bookingOverlay.classList.remove('sticky');
                }
            }
        });
    }
}

// Sticky booking bar for rooms page
function setupStickyBookingBar() {
    const bookingSticky = document.getElementById('bookingSticky');
    if (bookingSticky) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                bookingSticky.style.transform = 'translateY(0)';
            } else {
                bookingSticky.style.transform = 'translateY(-100%)';
            }
        });
    }
}

// Amenities navigation
function setupAmenitiesNavigation() {
    const amenitiesNavLinks = document.querySelectorAll('.amenities-nav-list a');
    amenitiesNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            amenitiesNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Load saved user preferences
function loadSavedPreferences() {
    const preferences = getBookingPreferences();
    
    if (preferences.arrivalDate) {
        const arrivalInput = document.getElementById('arrival') || document.getElementById('arrivalDate');
        if (arrivalInput) arrivalInput.value = preferences.arrivalDate;
    }
    if (preferences.departureDate) {
        const departureInput = document.getElementById('departure') || document.getElementById('departureDate');
        if (departureInput) departureInput.value = preferences.departureDate;
    }
    if (preferences.adults) {
        const adultsSelect = document.getElementById('adults');
        if (adultsSelect) adultsSelect.value = preferences.adults;
    }
    if (preferences.children) {
        const childrenSelect = document.getElementById('children');
        if (childrenSelect) childrenSelect.value = preferences.children;
    }
}

// Populate time options for forms
function populateTimeOptions() {
    const timeSelects = document.querySelectorAll('select[id$="Time"]');
    const times = [
        '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
        '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
        '08:00 PM', '08:30 PM', '09:00 PM'
    ];

    timeSelects.forEach(select => {
        const options = times.map(time => `<option value="${time}">${time}</option>`).join('');
        select.innerHTML = '<option value="">Select Time</option>' + options;
    });
}

// Set minimum dates to today
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
        
        if (input.id === 'arrival' || input.id === 'arrivalDate') {
            input.value = today;
        }
        
        if (input.id === 'departure' || input.id === 'departureDate') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            input.value = tomorrow.toISOString().split('T')[0];
        }
    });
}

// Setup rooms modal functionality
function setupRoomsModal() {
    const roomModal = document.getElementById('roomModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');

    if (closeModal && roomModal) {
        closeModal.addEventListener('click', () => {
            roomModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (roomModal) {
        window.addEventListener('click', (e) => {
            if (e.target === roomModal) {
                roomModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Setup rooms form functionality
function setupRoomsForm() {
    const bookingForm = document.getElementById('roomBookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('change', () => {
            const preferences = {
                arrivalDate: document.getElementById('arrivalDate').value,
                departureDate: document.getElementById('departureDate').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value
            };
            saveBookingPreferences(preferences);
        });

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const searchParams = new URLSearchParams(formData);
            window.location.href = `form-action.html?${searchParams.toString()}`;
        });
    }
}

// Create room modal content for rooms page
function createRoomModal(roomData) {
    const roomModal = document.getElementById('roomModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!roomModal || !modalContent) return;

    const modalHTML = `
        <h2>${escapeHTML(roomData.name)}</h2>
        <div class="modal-room-details">
            <div class="modal-image-container">
                <img src="${escapeHTML(roomData.image)}" 
                     alt="${escapeHTML(roomData.name)}" 
                     class="modal-room-image" 
                     loading="lazy"
                     onerror="this.src='${imageConfig.placeholder}'">
                <div class="image-loading" style="display: none;">Loading...</div>
            </div>
            <div class="modal-room-info">
                <div class="room-price">$${roomData.price}/night</div>
                <p>${escapeHTML(roomData.description)}</p>
                <ul class="room-features">
                    <li>👥 Capacity: ${roomData.capacity} guests</li>
                    <li>🛏️ ${roomData.bedType || 'Queen Bed'}</li>
                    <li>📏 ${roomData.size || '300 sq ft'}</li>
                    <li>${roomData.view ? `🌅 ${roomData.view}` : '🪟 City View'}</li>
                </ul>
                <button class="book-btn" style="width: 100%; margin-top: 1rem;" onclick="bookThisRoom('${roomData.id}')">Book Now</button>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = modalHTML;
    roomModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    const modalImage = modalContent.querySelector('.modal-room-image');
    if (modalImage) {
        const loadingIndicator = modalContent.querySelector('.image-loading');
        
        modalImage.addEventListener('load', () => {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        });
        
        modalImage.addEventListener('error', () => {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        });
        
        if (!modalImage.complete) {
            if (loadingIndicator) loadingIndicator.style.display = 'block';
        }
    }
}

// Book room function
function bookThisRoom(roomId) {
    const searchParams = new URLSearchParams({
        room: roomId,
        bookingType: 'room'
    });
    window.location.href = `form-action.html?${searchParams.toString()}`;
}

// Setup room detail button event listeners
function setupRoomDetailButtons() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                const roomData = JSON.parse(e.target.getAttribute('data-room').replace(/&#39;/g, "'"));
                createRoomModal(roomData);
            } catch (error) {
                console.error('Error parsing room data:', error);
                showError('Unable to load room details. Please try again.');
            }
        });
    });
}

// Preload critical images
function preloadCriticalImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Get optimized image URL
function getOptimizedImageUrl(originalUrl, width = 800) {
    return originalUrl;
}

// Check if image exists
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        margin: 1rem 0;
        text-align: center;
        padding: 1rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 4px;
        color: #c33;
    `;

    const main = document.querySelector('main');
    if (main) {
        main.prepend(errorDiv);
    } else {
        document.body.prepend(errorDiv);
    }
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Export functions
export { 
    createRoomModal, 
    setupRoomDetailButtons, 
    showError,
    preloadCriticalImages,
    getOptimizedImageUrl,
    checkImageExists,
    openImageModal
};

// Make functions available globally
window.createRoomModal = createRoomModal;
window.bookThisRoom = bookThisRoom;
window.openImageModal = openImageModal;

