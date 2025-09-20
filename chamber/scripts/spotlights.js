const spotlightsContainer = document.getElementById('spotlightsContainer');

// Fetch member data and filter spotlight members
async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    const data = await response.json();
    const members = data.members;

    // Filter only Gold (3) or Silver (2) members
    const spotlightMembers = members.filter(member => member.membership === 3 || member.membership === 2);

    // Randomly select 3 unique spotlight members
    const selected = getRandomItems(spotlightMembers, 3);

    // Render spotlights
    displaySpotlights(selected);
  } catch (error) {
    console.error('Error loading spotlights:', error);
  }
}

// Helper to get random items
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Render spotlight members
function displaySpotlights(members) {
  spotlightsContainer.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('directory-card');

    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}" loading="lazy">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p>Membership Level: ${getMembershipLevel(member.membership)}</p>
    `;

    spotlightsContainer.appendChild(card);
  });
}

// Convert numeric level to readable text
function getMembershipLevel(level) {
  switch (level) {
    case 1: return 'Member';
    case 2: return 'Silver';
    case 3: return 'Gold';
    default: return 'Member';
  }
}

// Initialize
loadSpotlights();

// View toggle logic
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

gridBtn.addEventListener('click', () => {
  spotlightsContainer.classList.remove('list');
  spotlightsContainer.classList.add('grid');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
  spotlightsContainer.classList.remove('grid');
  spotlightsContainer.classList.add('list');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});

// Set default view on load
spotlightsContainer.classList.add('grid');
gridBtn.classList.add('active');
