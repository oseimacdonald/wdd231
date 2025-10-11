import { getBookingPreferences, saveBookingPreferences } from './storage.js';
import { showModal } from './modal.js';

// Initialize all booking forms on the page
export function initializeBookingForms() {
    setupRoomBookingForms();
    setupFormPreferenceSaving();
    setMinimumDates();
}

// Set up room booking forms
function setupRoomBookingForms() {
    const roomBookingForms = document.querySelectorAll('form[id*="BookingForm"]');
    roomBookingForms.forEach(form => {
        form.addEventListener('submit', handleBookingFormSubmit);
    });
}

// Handle booking form submission
function handleBookingFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchParams = new URLSearchParams(formData);
    
    // Determine the type of booking
    const bookingType = formData.get('bookingType') || 'room';
    
    // Redirect to form action page with data
    window.location.href = `form-action.html?type=${bookingType}&${searchParams.toString()}`;
}

// Set up form preference saving
function setupFormPreferenceSaving() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('change', saveFormPreferences);
    });
}

// Save form preferences to local storage
function saveFormPreferences() {
    const preferences = {
        arrivalDate: getFormValue('arrival') || getFormValue('arrivalDate'),
        departureDate: getFormValue('departure') || getFormValue('departureDate'),
        adults: getFormValue('adults'),
        children: getFormValue('children')
    };
    
    saveBookingPreferences(preferences);
}

// Get value from form element
function getFormValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value : null;
}

// Set minimum dates to today
function setMinimumDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
}

// Display form data on form-action.html
export function displayFormData() {
    const confirmationDetails = document.getElementById('confirmationDetails');
    if (!confirmationDetails) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bookingType = urlParams.get('type') || 'room';
    
    let html = '<div class="booking-summary">';
    html += `<h3>${getBookingTypeTitle(bookingType)} Request</h3>`;
    html += '<ul class="booking-details">';
    
    urlParams.forEach((value, key) => {
        if (key !== 'type' && value) {
            html += `<li><strong>${formatFieldName(key)}:</strong> ${formatFieldValue(key, value)}</li>`;
        }
    });
    
    html += '</ul>';
    html += '<div class="confirmation-note">';
    html += '<p>Thank you for your booking request! Our team will contact you within 24 hours to confirm your reservation.</p>';
    html += '</div>';
    html += '</div>';
    
    confirmationDetails.innerHTML = html;
}

// Get booking type title
function getBookingTypeTitle(type) {
    const titles = {
        'room': 'Room Booking',
        'restaurant': 'Restaurant Reservation',
        'event': 'Event Inquiry',
        'spa': 'Spa Treatment'
    };
    return titles[type] || 'Booking';
}

// Format field names for display
function formatFieldName(fieldName) {
    const names = {
        'arrival': 'Arrival Date',
        'departure': 'Departure Date',
        'adults': 'Number of Adults',
        'children': 'Number of Children',
        'pets': 'Number of Pets',
        'date': 'Date',
        'time': 'Time',
        'menu': 'Menu Preference',
        'arrivalTime': 'Arrival Time',
        'departureTime': 'Departure Time',
        'spaDate': 'Spa Date',
        'spaTime': 'Spa Time',
        'spaService': 'Spa Service',
        'spaGuests': 'Spa Guests',
        'restaurantDate': 'Restaurant Date',
        'restaurantTime': 'Restaurant Time',
        'restaurantGuests': 'Number of Guests',
        'restaurantOccasion': 'Occasion'
    };
    return names[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

// Format field values for display
function formatFieldValue(fieldName, value) {
    if (fieldName.includes('Date') && value) {
        return new Date(value).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    const specialValues = {
        'menu': {
            'regular': 'Regular Menu',
            'vegetarian': 'Vegetarian',
            'vegan': 'Vegan',
            'gluten-free': 'Gluten Free'
        },
        'restaurantOccasion': {
            'anniversary': 'Anniversary',
            'birthday': 'Birthday',
            'business': 'Business Dinner',
            'celebration': 'Celebration'
        }
    };
    
    for (const [key, mapping] of Object.entries(specialValues)) {
        if (fieldName.includes(key) && mapping[value]) {
            return mapping[value];
        }
    }
    
    return value;
}