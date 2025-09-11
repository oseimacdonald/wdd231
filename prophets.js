// Declare constants
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// Async function to get prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.table(data.prophets); // Check data response
        displayProphets(data.prophets);
    } catch (error) {
        console.error('Could not fetch data:', error);
        cards.innerHTML = '<p>Error loading prophet data. Please try again later.</p>';
    }
}

// Function to display prophets
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create elements
        let card = document.createElement('section');
        card.classList.add('card');
        
        let fullName = document.createElement('h2');
        let portrait = document.createElement('img');
        let prophetNumber = document.createElement('div');
        prophetNumber.classList.add('prophet-number');
        
        let birthInfo = document.createElement('div');
        birthInfo.classList.add('birth-info');
        
        let birthDate = document.createElement('p');
        let birthPlace = document.createElement('p');
        let deathDate = document.createElement('p');
        let children = document.createElement('p');
        let yearsAsProphet = document.createElement('p');
        
        // Build content
        prophetNumber.textContent = `Prophet #${prophet.order}`;
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        birthDate.textContent = `Born: ${prophet.birthdate}`;
        birthPlace.textContent = `Place: ${prophet.birthplace}`;
        
        if (prophet.death) {
            deathDate.textContent = `Died: ${prophet.death}`;
        } else {
            deathDate.textContent = 'Current Prophet';
        }
        
        children.textContent = `Children: ${prophet.numofchildren}`;
        yearsAsProphet.textContent = `Years as Prophet: ${prophet.length || 'N/A'}`;
        
        // Build image
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        // Append elements
        birthInfo.appendChild(birthDate);
        birthInfo.appendChild(birthPlace);
        birthInfo.appendChild(deathDate);
        birthInfo.appendChild(children);
        birthInfo.appendChild(yearsAsProphet);
        
        let cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.appendChild(prophetNumber);
        cardContent.appendChild(fullName);
        cardContent.appendChild(birthInfo);
        
        card.appendChild(portrait);
        card.appendChild(cardContent);
        
        cards.appendChild(card);
    });
}

// Call the function to get data
getProphetData();
