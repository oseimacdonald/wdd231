// js/modules/storage.js
export function saveUserPreferences(preferences) {
    localStorage.setItem('danaHotelPreferences', JSON.stringify(preferences));
}

export function getUserPreferences() {
    return JSON.parse(localStorage.getItem('danaHotelPreferences')) || {};
}