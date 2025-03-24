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
    listDiv.innerHTML = 'Loading...';
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) throw new Error('Type not found');
        const data = await response.json();
        const pokemonList = data.pokemon.slice(0, 10); // Limit to 10 for simplicity
        listDiv.innerHTML = pokemonList.map(p => `<p>${p.pokemon.name}</p>`).join('');
    } catch (error) {
        listDiv.innerHTML = `<p>${error.message}</p>`;
    }
}