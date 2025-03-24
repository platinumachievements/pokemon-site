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
    const name = document.getElementById('pokemonName').value.toLowerCase();
    const resultDiv = document.getElementById('pokemonResult');
    resultDiv.innerHTML = 'Loading...';
    try {
        // Add proper accept header to tell server we want SVG
        const response = await fetch(`/pokemon?name=${name}`, {
            headers: {
                'Accept': 'image/svg+xml'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Pokémon not found');
        }
        
        // Check content type to decide how to handle response
        const contentType = response.headers.get('Content-Type') || '';
        
        if (contentType.includes('image/svg+xml')) {
            // Handle SVG image response using an img tag
            const svgText = await response.text();
            const blob = new Blob([svgText], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(blob);
            
            resultDiv.innerHTML = `<img src="${url}" alt="Pokemon card" style="max-width:100%; height:auto;">`;
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