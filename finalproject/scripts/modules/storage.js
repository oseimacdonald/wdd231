// Local storage keys
const STORAGE_KEYS = {
    PREFERENCES: 'danaHotelPreferences',
    FAVORITES: 'danaHotelFavorites',
    LANGUAGE: 'danaHotelLanguage'
};

// Save booking preferences to local storage
export function saveBookingPreferences(preferences) {
    try {
        const currentPreferences = getBookingPreferences();
        const updatedPreferences = { ...currentPreferences, ...preferences };
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPreferences));
        return true;
    } catch (error) {
        console.error('Error saving booking preferences:', error);
        return false;
    }
}

// Get booking preferences from local storage
export function getBookingPreferences() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES)) || {};
    } catch (error) {
        console.error('Error getting booking preferences:', error);
        return {};
    }
}

// Save favorite rooms
export function saveFavoriteRooms(roomIds) {
    try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(roomIds));
        return true;
    } catch (error) {
        console.error('Error saving favorite rooms:', error);
        return false;
    }
}

// Get favorite rooms
export function getFavoriteRooms() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
    } catch (error) {
        console.error('Error getting favorite rooms:', error);
        return [];
    }
}

// Save language preference
export function saveLanguagePreference(language) {
    try {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
        return true;
    } catch (error) {
        console.error('Error saving language preference:', error);
        return false;
    }
}

// Get language preference
export function getLanguagePreference() {
    try {
        return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch (error) {
        console.error('Error getting language preference:', error);
        return 'en';
    }
}

// Clear all stored data
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing stored data:', error);
        return false;
    }
}

// Check if local storage is available
export function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.error('Local storage is not available:', error);
        return false;
    }
}