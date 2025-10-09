// js/modules/modal.js

// Initialize modal system
export function initModalSystem() {
    // Close modals when navigating away
    window.addEventListener('beforeunload', closeAllModals);
    
    // Clean up any orphaned modals
    document.addEventListener('DOMContentLoaded', () => {
        const orphanedModals = document.querySelectorAll('.modal');
        orphanedModals.forEach(modal => {
            if (modal.cleanup) modal.cleanup();
            modal.remove();
        });
        document.body.style.overflow = '';
    });

    // Add global ESC key listener for any modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Setup modal (alias for initModalSystem for backward compatibility)
export function setupModal() {
    initModalSystem();
    console.log('Modal system initialized');
}

// Main modal display function
export function showModal(roomData) {
    console.log('Show modal with data:', roomData);
    
    // Close any existing modals first
    closeAllModals();
    
    return createRoomModal(roomData);
}

// Create and display room modal
export function createRoomModal(roomData) {
    try {
        // Validate room data
        if (!roomData || typeof roomData !== 'object') {
            throw new Error('Invalid room data provided');
        }

        if (!roomData.name || roomData.price === undefined) {
            throw new Error('Room data missing required properties');
        }

        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.style.display = 'none'; // Start hidden
        
        // Generate unique ID for accessibility
        const modalId = `room-modal-${roomData.id}`;
        modal.id = modalId;

        // Create modal content with enhanced features
        const modalHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Close modal" tabindex="0">
                    &times;
                </button>
                <h2 id="modal-title" class="modal-title">${escapeHTML(roomData.name)}</h2>
                <div class="modal-room-details">
                    <div class="modal-image-container">
                        <img src="${escapeHTML(roomData.image)}" 
                             alt="${escapeHTML(roomData.name)}" 
                             class="modal-room-image"
                             loading="lazy"
                             onerror="this.src='images/fallback-room.jpg'; this.alt='Room image not available'">
                    </div>
                    <div class="modal-info">
                        <div class="room-price">$${roomData.price}/night</div>
                        <p class="room-description">${escapeHTML(roomData.description)}</p>
                        <div class="room-highlights">
                            <h3>Room Highlights</h3>
                            <ul class="room-features" role="list">
                                <li>👥 <strong>Capacity:</strong> ${roomData.capacity} guests</li>
                                <li>🛏️ <strong>Bed Type:</strong> ${roomData.bedType || 'Queen Bed'}</li>
                                <li>📏 <strong>Size:</strong> ${roomData.size || '300 sq ft'}</li>
                                <li>${roomData.view ? `🌅 <strong>View:</strong> ${roomData.view}` : '🪟 <strong>View:</strong> City View'}</li>
                                ${roomData.amenities ? `<li>✨ <strong>Amenities:</strong> ${roomData.amenities.join(', ')}</li>` : ''}
                            </ul>
                        </div>
                        <div class="modal-actions">
                            <button class="book-btn modal-book-btn" tabindex="0">
                                Book This Room
                            </button>
                            <button class="view-more-btn modal-close-btn" tabindex="0">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.innerHTML = modalHTML;

        // Add modal to DOM
        document.body.appendChild(modal);
        
        // Store reference to the trigger element for focus management
        const triggerElement = document.activeElement;

        // Set up event listeners
        setupModalEvents(modal, triggerElement, roomData);

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus on close button for accessibility
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.focus();
        });

        return modal;

    } catch (error) {
        console.error('Error creating room modal:', error);
        // Fallback: show error message to user
        showModalError('Unable to display room details. Please try again.');
        return null;
    }
}

// Setup modal event listeners
function setupModalEvents(modal, triggerElement, roomData) {
    const closeBtn = modal.querySelector('.close-modal');
    const modalContent = modal.querySelector('.modal-content');
    const closeSecondaryBtn = modal.querySelector('.modal-close-btn');

    // Close modal function
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            if (modal.cleanup) modal.cleanup();
            modal.remove();
            document.body.style.overflow = '';
            // Return focus to trigger element
            if (triggerElement && document.body.contains(triggerElement)) {
                triggerElement.focus();
            }
        }, 300);
    };

    // Close button click
    closeBtn.addEventListener('click', closeModal);
    
    // Secondary close button
    if (closeSecondaryBtn) {
        closeSecondaryBtn.addEventListener('click', closeModal);
    }

    // ESC key to close
    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
        }
    };

    // Click outside to close
    const handleOutsideClick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Focus trap - keep focus within modal
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    };

    // Add event listeners
    modal.addEventListener('click', handleOutsideClick);
    modal.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscKey);

    // Book button click
    const bookBtn = modal.querySelector('.modal-book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            console.log('Booking room:', roomData.name);
            // Navigate to booking form with room pre-selected
            const searchParams = new URLSearchParams({
                room: roomData.id,
                roomName: roomData.name,
                price: roomData.price
            });
            window.location.href = `form-action.html?${searchParams.toString()}`;
        });
    }

    // Cleanup function
    modal.cleanup = () => {
        document.removeEventListener('keydown', handleEscKey);
        modal.removeEventListener('keydown', handleTabKey);
        modal.removeEventListener('click', handleOutsideClick);
        
        if (closeSecondaryBtn) {
            closeSecondaryBtn.removeEventListener('click', closeModal);
        }
        if (bookBtn) {
            bookBtn.removeEventListener('click', () => {});
        }
    };
}

// Utility function to close any open modals
export function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.cleanup) {
            modal.cleanup();
        }
        modal.remove();
    });
    document.body.style.overflow = '';
}

// Show modal error message
function showModalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fee;
        color: #c33;
        padding: 1rem 2rem;
        border-radius: 8px;
        border: 1px solid #c33;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Utility function to check if modal is open
export function isModalOpen() {
    return document.querySelectorAll('.modal').length > 0;
}

// Utility function to get current open modal
export function getCurrentModal() {
    return document.querySelector('.modal');
}