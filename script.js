// client side

// async function fetchPokemon() {
//     const name = document.getElementById('pokemonName').value.toLowerCase();
//     const resultDiv = document.getElementById('pokemonResult');
//     resultDiv.innerHTML = 'Loading...';
//     try {
//         const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
//         if (!response.ok) throw new Error('Pokémon not found');
//         const data = await response.json();
//         resultDiv.innerHTML = `
//             <h2>${data.name}</h2>
//             <img src="${data.sprites.front_default}" alt="${data.name}">
//             <p>Height: ${data.height} | Weight: ${data.weight}</p>
//         `;
//     } catch (error) {
//         resultDiv.innerHTML = `<p>${error.message}</p>`;
//     }
// }

// server side
async function fetchPokemon() {
    const name = document.getElementById('pokemonName').value.toLowerCase().trim();
    if (!name) {
        document.getElementById('pokemonResult').innerHTML = '<p class="error">Please enter a Pokémon name</p>';
        return;
    }
    
    const resultDiv = document.getElementById('pokemonResult');
    resultDiv.innerHTML = 'Loading...';
    
    try {
        // Construct the URL
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/pokemon?name=${encodeURIComponent(name)}`;
        console.log('Fetching from URL:', url);
        
        // Directly fetch the SVG using an image element
        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.alt = `${name} Pokemon card`;
        
        // Create download buttons
        const svgLink = document.createElement('a');
        svgLink.href = url;
        svgLink.className = 'download-btn';
        svgLink.textContent = 'Download SVG';
        svgLink.download = `${name}.svg`;
        
        const pngLink = document.createElement('a');
        pngLink.href = `${url}&download=true`;
        pngLink.className = 'download-btn';
        pngLink.textContent = 'Download PNG';
        pngLink.target = '_blank';
        
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'card-actions';
        buttonDiv.appendChild(svgLink);
        buttonDiv.appendChild(pngLink);
        
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.appendChild(img);
        cardContainer.appendChild(buttonDiv);
        
        // Clear previous content
        resultDiv.innerHTML = '';
        resultDiv.appendChild(cardContainer);
        
        // Set the image src after adding to DOM to prevent flashes
        img.src = url;
        
        // Handle errors with the image
        img.onerror = function() {
            resultDiv.innerHTML = '<p class="error">Failed to load the Pokemon card. Please try again.</p>';
        };
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
        console.error('Error:', error);
    }
}

async function fetchPokemonByType() {
    const type = document.getElementById('pokemonType').value.toLowerCase();
    const listDiv = document.getElementById('pokemonList');
    const loadingIndicator = document.getElementById('loading');
    
    if (!type) {
        listDiv.innerHTML = '<p class="error">Please enter a Pokémon type</p>';
        return;
    }
    
    // Clear previous results and show loading
    listDiv.innerHTML = '';
    loadingIndicator.style.display = 'block';
    
    try {
        // First fetch the type information to get a list of Pokemon
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!typeResponse.ok) throw new Error('Type not found');
        
        const typeData = await typeResponse.json();
        
        // Get a random selection of 10 Pokemon from this type
        const allPokemon = typeData.pokemon;
        let selectedPokemon = [];
        
        if (allPokemon.length <= 10) {
            selectedPokemon = allPokemon;
        } else {
            // Get 10 random Pokemon
            const shuffled = [...allPokemon].sort(() => 0.5 - Math.random());
            selectedPokemon = shuffled.slice(0, 10);
        }
        
        // For each Pokemon, fetch its card
        const pokemonPromises = selectedPokemon.map(p => 
            fetchPokemonCard(p.pokemon.name, listDiv)
        );
        
        // Wait for all cards to be created
        await Promise.all(pokemonPromises);
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // If no results, show message
        if (selectedPokemon.length === 0) {
            listDiv.innerHTML = `<p>No Pokémon found for type: ${type}</p>`;
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        listDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function fetchPokemonCard(name, container) {
    try {
        // Construct the URL for our Pokemon worker
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/pokemon?name=${encodeURIComponent(name)}`;
        
        // Create a card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'mini-card';
        
        // Create an iframe to display the SVG
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.title = `${name} card`;
        
        // Add click handler to open the full card in a new window
        cardContainer.addEventListener('click', () => {
            window.open(url, '_blank');
        });
        
        // Add to the container
        cardContainer.appendChild(iframe);
        container.appendChild(cardContainer);
    } catch (error) {
        console.error(`Error fetching card for ${name}:`, error);
    }
}