// scripts/modules/api.js

// =============================================
// DATA FETCHING FUNCTIONS
// =============================================

export async function fetchRoomData() {
    try {
        // API INTEGRATION: Fetching from JSON file
        const response = await fetch('./scripts/data/rooms.json');

        // HTTP error handling
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();

        // Validate structure - Comprehensive structure checking
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format: expected object');
        }

        if (!Array.isArray(data.rooms)) {
            throw new Error('Invalid data format: rooms array missing');
        }

        if (!Array.isArray(data.amenities)) {
            throw new Error('Invalid data format: amenities array missing');
        }

        // Validate individual item properties
        const allItems = [...data.rooms, ...data.amenities];
        allItems.forEach((item, index) => {
            if (!item.id && item.id !== 0) {
                throw new Error(`Item at index ${index} missing required 'id' property`);
            }
            if (!item.name) {
                throw new Error(`Item ${item.id} missing required 'name' property`);
            }
            if (!item.type) {
                throw new Error(`Item ${item.id} missing required 'type' property`);
            }
            if (item.price === undefined) {
                throw new Error(`Item ${item.id} missing required 'price' property`);
            }
        });

        const totalItems = data.rooms.length + data.amenities.length;
        if (totalItems < 15) {
            // Silent warning for minimum items
        }

        return data;

    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
        } else if (error.name === 'SyntaxError') {
            throw new Error('Data format error: Invalid JSON received from server.');
        } else {
            throw new Error(`Failed to load room data: ${error.message}`);
        }
    }
}

export async function fetchRooms() {
    try {
        const data = await fetchRoomData();
        return data.rooms || [];
    } catch (error) {
        return [];
    }
}

export async function fetchAmenities() {
    try {
        const data = await fetchRoomData();
        return data.amenities || [];
    } catch (error) {
        return [];
    }
}

// =============================================
// ROOM DISPLAY FUNCTIONS
// =============================================

export async function displayFeaturedRooms() {
    try {
        const roomsContainer = document.getElementById('roomsContainer');
        const errorMessage = document.getElementById('errorMessage');

        if (!roomsContainer) {
            return;
        }
        
        // AWAIT: Waiting for async data fetch
        const rooms = await fetchRooms();

        if (!rooms || rooms.length === 0) {
            throw new Error('No room data available');
        }

        const featuredRooms = rooms.slice(0, 4);

        const roomsHTML = featuredRooms.map(room => `
            <div class="room-card" data-room-id="${room.id}">
                <img src="${room.image}" alt="${room.name}" class="room-image" loading="lazy" onerror="this.style.display='none'">
                <div class="room-content">
                    <h3 class="room-title">${room.name}</h3>
                    <div class="room-price">$${room.price}/night</div>
                    <p>${room.description}</p>
                    <ul class="room-features">
                        <li>👥 Capacity: ${room.capacity} guests</li>
                        <li>🛏️ ${room.bedType || 'Premium Bedding'}</li>
                        <li>📏 ${room.size || 'Spacious Layout'}</li>
                        <li>${room.view ? `🌅 ${room.view}` : '🪟 Scenic View'}</li>
                    </ul>
                    <a href="rooms.html#room-${room.id}" class="view-more-btn">View Details</a>
                </div>
            </div>
        `).join('');

        roomsContainer.innerHTML = roomsHTML;

    } catch (error) {
        if (errorMessage) {
            errorMessage.textContent = 'Unable to load room information. Please try again later.';
            errorMessage.style.display = 'block';
        }
    }
}

export async function displayAllRooms() {
    try {
        const roomsContainer = document.getElementById('roomsContainer');
        const errorMessage = document.getElementById('errorMessage');

        if (!roomsContainer) {
            return;
        }

        const rooms = await fetchRooms();

        if (!rooms || rooms.length === 0) {
            throw new Error('No room data available');
        }

        const roomsHTML = rooms.map(room => `
            <div class="room-card" data-room-id="${room.id}">
                <img src="${room.image}" alt="${room.name}" class="room-image" loading="lazy" onerror="this.style.display='none'">
                <div class="room-content">
                    <h3 class="room-title">${room.name}</h3>
                    <div class="room-price">$${room.price}/night</div>
                    <p>${room.description}</p>
                    <ul class="room-features">
                        <li>👥 Capacity: ${room.capacity} guests</li>
                        <li>🛏️ ${room.bedType || 'Premium Bedding'}</li>
                        <li>📏 ${room.size || 'Spacious Layout'}</li>
                        <li>${room.view ? `🌅 ${room.view}` : '🪟 Scenic View'}</li>
                    </ul>
                    <button class="view-details-btn" data-room='${JSON.stringify(room).replace(/'/g, "&#39;")}'>
                        View Details & Book
                    </button>
                </div>
            </div>
        `).join('');

        roomsContainer.innerHTML = roomsHTML;
        
        // Setup room event listeners after DOM is updated
        setTimeout(() => {
            setupRoomEventListeners();
        }, 100);

    } catch (error) {
        if (errorMessage) {
            errorMessage.textContent = 'Unable to load room information. Please try again later.';
            errorMessage.style.display = 'block';
        }
    }
}

// =============================================
// AMENITIES DISPLAY FUNCTIONS
// =============================================

export async function displayAmenitiesPreview() {
    try {
        const container = document.getElementById('amenitiesPreviewContainer');
        if (!container) {
            return;
        }

        const amenities = await fetchAmenities();

        if (!amenities || amenities.length === 0) {
            throw new Error('No amenities data available');
        }

        const keyAmenityNames = ['Serenity Spa', 'Aura Restaurant', 'Infinity Pool', 'Elite Fitness Center'];
        const previewAmenities = amenities.filter(amenity =>
            keyAmenityNames.includes(amenity.name)
        ).slice(0, 4);

        const finalAmenities = previewAmenities.length > 0 ? previewAmenities : amenities.slice(0, 4);

        const amenitiesHTML = finalAmenities.map(amenity => `
            <div class="amenity-card">
                <img src="${amenity.image}" alt="${amenity.name}" class="amenity-preview-image" loading="lazy"
                     onerror="this.style.display='none'">
                <h3>${amenity.name}</h3>
                <p>${amenity.description}</p>
                <a href="amenities.html#${amenity.name.toLowerCase().replace(/\s+/g, '-')}" class="learn-more-btn">Learn More</a>
            </div>
        `).join('');

        container.innerHTML = amenitiesHTML;

    } catch (error) {
        const container = document.getElementById('amenitiesPreviewContainer');
        if (container) {
            container.innerHTML = `
                <div class="amenity-card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>Unable to load amenities preview. Please visit our amenities page.</p>
                    <a href="amenities.html" class="learn-more-btn">View All Amenities</a>
                </div>
            `;
        }
    }
}

export async function displayAmenities() {
    try {
        const amenitiesContainer = document.getElementById('amenitiesContainer');
        if (!amenitiesContainer) {
            return;
        }

        const amenities = await fetchAmenities();

        if (!amenities || amenities.length === 0) {
            throw new Error('No amenities data available');
        }

        const amenitiesHTML = amenities.map(amenity => `
            <div class="amenity-card" id="amenity-${amenity.id}">
                <img src="${amenity.image}" alt="${amenity.name}" class="amenity-image" loading="lazy"
                     onerror="this.style.display='none'">
                <div class="amenity-content">
                    <h3>${amenity.name}</h3>
                    <p>${amenity.description}</p>
                    <div class="amenity-details">
                        <div class="amenity-price">${amenity.price === 0 ? 'Included' : `$${amenity.price}`}</div>
                        <div class="amenity-hours">🕐 ${amenity.hours || 'Check hours'}</div>
                    </div>
                    <ul class="amenity-features">
                        ${amenity.amenities ? amenity.amenities.map(feature =>
                            `<li>✨ ${feature}</li>`
                        ).join('') : ''}
                    </ul>
                </div>
            </div>
        `).join('');

        amenitiesContainer.innerHTML = amenitiesHTML;

    } catch (error) {
        showAmenitiesError('Unable to load amenities information. Please try again later.');
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function setupRoomEventListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                const roomData = JSON.parse(e.target.getAttribute('data-room').replace(/&#39;/g, "'"));
                
                // Check if we're on the rooms page and use the rooms page modal
                if (window.location.pathname.includes('rooms.html') || window.location.pathname.endsWith('rooms.html')) {
                    // Use rooms page modal functionality
                    if (window.createRoomModal) {
                        window.createRoomModal(roomData);
                    } else {
                        // Fallback to main modal system
                        if (window.showModal) {
                            window.showModal(roomData);
                        }
                    }
                } else {
                    // Use main modal system for other pages
                    if (window.showModal) {
                        window.showModal(roomData);
                    }
                }
            } catch (error) {
                showError('Unable to load room details. Please try again.');
            }
        });
    });
}

function showAmenitiesError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.margin = '1rem 0';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.padding = '2rem';

    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(errorDiv, main.firstChild);
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.margin = '1rem 0';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.padding = '1rem';

    // Try to insert near the relevant container
    const roomsContainer = document.getElementById('roomsContainer');
    if (roomsContainer) {
        roomsContainer.parentNode.insertBefore(errorDiv, roomsContainer);
    } else {
        document.body.prepend(errorDiv);
    }
}

function validateRoomData(room) {
    const requiredFields = ['id', 'name', 'price', 'image', 'description'];
    const missingFields = requiredFields.filter(field => !room[field] && room[field] !== 0);

    if (missingFields.length > 0) {
        return false;
    }

    return true;
}

// =============================================
// DATA PROCESSING FUNCTIONS (Array Methods)
// =============================================

export function filterRoomsByType(rooms, type) {
    if (!Array.isArray(rooms)) return [];
    
    return rooms.filter(room => room.type === type);
}

export function filterRoomsByPrice(rooms, maxPrice) {
    if (!Array.isArray(rooms)) return [];
    
    return rooms.filter(room => room.price <= maxPrice);
}

export function sortRoomsByPrice(rooms, ascending = true) {
    if (!Array.isArray(rooms)) return [];
    
    return [...rooms].sort((a, b) => {
        return ascending ? a.price - b.price : b.price - a.price;
    });
}

export function getRoomTypes(rooms) {
    if (!Array.isArray(rooms)) return [];
    
    return rooms.reduce((types, room) => {
        if (!types.includes(room.type)) {
            types.push(room.type);
        }
        return types;
    }, []);
}

export function calculateAverageRoomPrice(rooms) {
    if (!Array.isArray(rooms) || rooms.length === 0) return 0;
    
    const total = rooms.reduce((sum, room) => sum + room.price, 0);
    return Math.round(total / rooms.length);
}

// =============================================
// EXPORT UTILITY FUNCTIONS FOR USE IN MAIN.JS
// =============================================

export { setupRoomEventListeners, showAmenitiesError, showError, validateRoomData };