const directoryContainer = document.getElementById('directoryContainer');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

// Fetch member data
async function getMembers() {
  try {
    const response = await fetch('data/members.json');
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error('Error fetching member data:', error);
  }
}

// Display members based on current view
function displayMembers(members) {
  directoryContainer.innerHTML = '';
  
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
    
    directoryContainer.appendChild(card);
  });
}

// Convert membership level number to text
function getMembershipLevel(level) {
  switch(level) {
    case 1: return 'Member';
    case 2: return 'Silver';
    case 3: return 'Gold';
    default: return 'Member';
  }
}

// View toggle functionality
gridBtn.addEventListener('click', () => {
  directoryContainer.classList.remove('list');
  directoryContainer.classList.add('grid');
  gridBtn.disabled = true;
  listBtn.disabled = false;
});

listBtn.addEventListener('click', () => {
  directoryContainer.classList.remove('grid');
  directoryContainer.classList.add('list');
  listBtn.disabled = true;
  gridBtn.disabled = false;
});

// Initialize
getMembers();
// Set grid as default view and disable its button
gridBtn.disabled = true;

