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
        // Ensure we have a clean URL by constructing it properly
        const baseUrl = window.location.origin;
        const url = new URL('/pokemon', baseUrl);
        url.searchParams.append('name', name);
        
        console.log('Fetching from URL:', url.toString());
        
        // Add proper accept header to tell server we want SVG
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'image/svg+xml'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Pokémon not found (Status: ${response.status})`);
        }
        
        // Check content type to decide how to handle response
        const contentType = response.headers.get('Content-Type') || '';
        console.log('Response content type:', contentType);
        
        if (contentType.includes('image/svg+xml')) {
            // Handle SVG image response using an img tag
            const svgText = await response.text();
            console.log('SVG received, length:', svgText.length);
            
            // Use data URI for simplicity and reliability
            const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
            
            // Create a download URL for PNG
            const pngDownloadUrl = `${url.toString()}&download=true`;
            
            resultDiv.innerHTML = `
                <div class="card-container">
                    <img src="${dataUri}" alt="Pokemon card" style="max-width:100%; height:auto;">
                    <div class="card-actions">
                        <a href="${dataUri}" download="${name}.svg" class="download-btn">Download SVG</a>
                        <a href="${pngDownloadUrl}" target="_blank" class="download-btn">Download PNG</a>
                    </div>
                </div>
            `;
        } else if (contentType.includes('application/json')) {
            // Handle JSON response
            const data = await response.json();
            resultDiv.innerHTML = `<p>Received JSON: ${JSON.stringify(data)}</p>`;
        } else {
            // Handle other response types
            const text = await response.text();
            resultDiv.innerHTML = `<div class="error">Unexpected response format: ${contentType}</div>`;
            console.error('Unexpected response:', text);
        }
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