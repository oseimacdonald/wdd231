// js/main.js

// Import modules
import { displayFeaturedRooms, displayAllRooms, displayAmenitiesPreview, displayAmenities } from './modules/api.js';
import { setupModal, showModal } from './modules/modal.js';
import { saveBookingPreferences, getBookingPreferences } from './modules/storage.js';
import { initializeBookingForms, displayFormData } from './modules/booking.js';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBookingForms();
    setupModal();
    setMinimumDates();
    
    // Page-specific initializations
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
}

// Home page initialization
function initializeHomePage() {
    displayFeaturedRooms();
    displayAmenitiesPreview();
    loadSavedPreferences();
    populateTimeOptions();
    setupStickyBooking();
    setupTabFunctionality();
}

// Rooms page initialization
function initializeRoomsPage() {
    displayAllRooms();
    loadSavedPreferences();
    setupStickyBookingBar();
    setupRoomsModal();
    setupRoomsForm();
}

// Amenities page initialization
function initializeAmenitiesPage() {
    displayAmenities();
    loadSavedPreferences();
    populateTimeOptions();
    setupAmenitiesNavigation();
}

// Form action page initialization
function initializeFormActionPage() {
    displayFormData();
}

// Tab functionality for booking forms
function setupTabFunctionality() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
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
    
    // Room booking form preferences
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
    });
}

// =============================================
// ROOMS PAGE SPECIFIC FUNCTIONALITY
// =============================================

// Setup rooms modal functionality
function setupRoomsModal() {
    const roomModal = document.getElementById('roomModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (roomModal) roomModal.style.display = 'none';
        });
    }

    if (roomModal) {
        window.addEventListener('click', (e) => {
            if (e.target === roomModal) {
                roomModal.style.display = 'none';
            }
        });
    }
}

// Setup rooms form functionality
function setupRoomsForm() {
    const bookingForm = document.getElementById('roomBookingForm');
    
    if (bookingForm) {
        // Save preferences when form changes
        bookingForm.addEventListener('change', () => {
            const preferences = {
                arrivalDate: document.getElementById('arrivalDate').value,
                departureDate: document.getElementById('departureDate').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value
            };
            saveBookingPreferences(preferences);
        });

        // Form submission
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const searchParams = new URLSearchParams(formData);
            window.location.href = `form-action.html?${searchParams.toString()}`;
        });
    }
}

// Create room modal content for rooms page
export function createRoomModal(roomData) {
    const roomModal = document.getElementById('roomModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!roomModal || !modalContent) return;

    const modalHTML = `
        <h2>${roomData.name}</h2>
        <div class="modal-room-details">
            <div>
                <img src="${roomData.image}" alt="${roomData.name}" class="modal-room-image" loading="lazy">
            </div>
            <div>
                <div class="room-price">$${roomData.price}/night</div>
                <p>${roomData.description}</p>
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
}

// Book room function
function bookThisRoom(roomId) {
    const searchParams = new URLSearchParams({
        room: roomId,
        bookingType: 'room'
    });
    window.location.href = `form-action.html?${searchParams.toString()}`;
}

// Make bookThisRoom available globally for onclick events
window.bookThisRoom = bookThisRoom;

// Setup room detail button event listeners
export function setupRoomDetailButtons() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomData = JSON.parse(e.target.getAttribute('data-room').replace(/&#39;/g, "'"));
            createRoomModal(roomData);
        });
    });
}