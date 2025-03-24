// Import the design system
import { getRandomDesign, getDesign } from './card-designs/index.js';

export async function onRequestGet({ request }) {
    // Start performance timing
    const startTime = Date.now();
    console.log(`[Pokemon Worker] Starting request for: ${request.url}`);
    
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (!name) {
        console.log(`[Pokemon Worker] Missing name parameter, request failed in ${Date.now() - startTime}ms`);
        return new Response('Missing name', { status: 400 });
    }

    // Check if a specific design was requested
    const designParam = url.searchParams.get('design');

    // Fetch Pokémon data
    console.log(`[Pokemon Worker] Fetching data for: ${name}`);
    const pokeApiStartTime = Date.now();
    const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    console.log(`[Pokemon Worker] PokeAPI response received in ${Date.now() - pokeApiStartTime}ms`);
    
    if (!pokeResponse.ok) {
        console.log(`[Pokemon Worker] Pokemon not found, request failed in ${Date.now() - startTime}ms`);
        return new Response('Pokémon not found', { status: 404 });
    }
    const pokemon = await pokeResponse.json();
    console.log(`[Pokemon Worker] Pokemon data parsed`);

    // Check if the client wants an image/png response
    const accept = request.headers.get('Accept') || '';
    const downloadParam = url.searchParams.get('download');
    
    if (downloadParam === 'true' || accept.includes('image/png')) {
        console.log(`[Pokemon Worker] PNG download requested, redirecting to conversion service`);
        // For image download requests, redirect to a popular image conversion service
        // that can convert our SVG to PNG on-the-fly
        const svgUrl = new URL(request.url);
        svgUrl.searchParams.delete('download');
        const encodedSvgUrl = encodeURIComponent(svgUrl.toString());
        
        // Redirect to a service that can convert SVG to PNG
        const redirectTime = Date.now() - startTime;
        console.log(`[Pokemon Worker] Redirect complete in ${redirectTime}ms`);
        return Response.redirect(`https://images.weserv.nl/?url=${encodedSvgUrl}&output=png&w=600`, 302);
    }

    // Format type for rendering
    const formattedTypes = pokemon.types.map(type => ({
        name: type.type.name,
        color: getTypeColor(type.type.name)
    }));
    
    // Get the sprite image data
    console.log(`[Pokemon Worker] Fetching sprite image from: ${spriteUrl}`);
    const spriteStartTime = Date.now();
    const spriteUrl = pokemon.sprites.front_default;
    const spriteResponse = await fetch(spriteUrl);
    const spriteArrayBuffer = await spriteResponse.arrayBuffer();
    const spriteBase64 = btoa(String.fromCharCode(...new Uint8Array(spriteArrayBuffer)));
    console.log(`[Pokemon Worker] Sprite fetched and encoded in ${Date.now() - spriteStartTime}ms`);
    
    console.log(`[Pokemon Worker] Generating SVG card with ${designParam || 'random'} design`);
    const svgStartTime = Date.now();
    
    // Get the design function (random or specified)
    const designFunction = designParam 
        ? getDesign(designParam)  // Use specified design
        : getRandomDesign();      // Use random design
    
    // Generate the SVG card using the selected design
    const svgCard = designFunction(pokemon, spriteBase64, formattedTypes);
    
    console.log(`[Pokemon Worker] SVG generated in ${Date.now() - svgStartTime}ms`);
    
    // Return SVG with appropriate headers
    const totalTime = Date.now() - startTime;
    console.log(`[Pokemon Worker] Request completed in ${totalTime}ms`);
    
    return new Response(svgCard, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600',
            'Content-Disposition': `inline; filename="${pokemon.name}.svg"`,
            'Server-Timing': `total;dur=${totalTime}, pokeapi;dur=${Date.now() - pokeApiStartTime}, sprite;dur=${Date.now() - spriteStartTime}`
        }
    });
}

// Helper function to get type colors
function getTypeColor(type) {
    const typeColors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    
    return typeColors[type] || '#777777';
}