// Load attractions data from JSON
async function loadAttractions() {
  try {
    const response = await fetch('data/discovery.json');
    const attractions = await response.json();
    displayAttractions(attractions);
  } catch (error) {
    console.error('Error loading attractions:', error);
  }
}

// Display attractions in the gallery
function displayAttractions(attractions) {
  const container = document.getElementById('attractionsContainer');
  
  attractions.forEach(attraction => {
    const card = document.createElement('div');
    card.className = 'attraction-card';
    
    card.innerHTML = `
      <figure>
        <img src="images/${attraction.image}" alt="${attraction.name}" loading="lazy">
      </figure>
      <figcaption>
        <h3>${attraction.name}</h3>
        <address>${attraction.address}</address>
        <p>${attraction.description}</p>
        <button class="learn-more-btn">Learn More</button>
      </figcaption>
    `;
    
    container.appendChild(card);
  });
}

// Track and display visitor information
function trackVisits() {
  const messageElement = document.getElementById('visitor-message');
  const lastVisit = localStorage.getItem('lastVisit');
  const currentVisit = Date.now();
  
  if (!lastVisit) {
    // First visit
    messageElement.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const lastVisitDate = parseInt(lastVisit);
    const daysBetween = Math.floor((currentVisit - lastVisitDate) / (1000 * 60 * 60 * 24));
    
    if (daysBetween < 1) {
      messageElement.textContent = "Back so soon! Awesome!";
    } else {
      const dayText = daysBetween === 1 ? "day" : "days";
      messageElement.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
    }
  }
  
  // Store current visit
  localStorage.setItem('lastVisit', currentVisit.toString());
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadAttractions();
  trackVisits();
});