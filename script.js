async function fetchPokemon() {
    const name = document.getElementById('pokemonName').value.toLowerCase();
    const resultDiv = document.getElementById('pokemonResult');
    resultDiv.innerHTML = 'Loading...';
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error('Pokémon not found');
        const data = await response.json();
        resultDiv.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Height: ${data.height} | Weight: ${data.weight}</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
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