// js/modules/api.js
export async function fetchRoomData() {
    try {
        const response = await fetch('./js/data/rooms.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching room data:', error);
        return [];
    }
}

// js/main.js
import { fetchRoomData } from './modules/api.js';
import { displayRooms } from './modules/booking.js';

async function initializePage() {
    const rooms = await fetchRoomData();
    displayRooms(rooms);
}