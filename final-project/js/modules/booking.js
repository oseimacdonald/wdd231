// js/modules/booking.js
export function displayRooms(rooms) {
    const availableRooms = rooms.filter(room => room.available);
    
    const roomHTML = availableRooms.map(room => `
        <div class="room-card" data-room-id="${room.id}">
            <h3>${room.name}</h3>
            <p>Price: $${room.price}/night</p>
            <p>Capacity: ${room.capacity} guests</p>
            <button class="view-details" data-room="${room.id}">
                View Details
            </button>
        </div>
    `).join('');
    
    document.getElementById('rooms-container').innerHTML = roomHTML;
}