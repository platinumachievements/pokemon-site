export async function onRequestGet({ request }) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (!name) return new Response('Missing name', { status: 400 });

    // Fetch Pokémon data
    const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!pokeResponse.ok) return new Response('Pokémon not found', { status: 404 });
    const pokemon = await pokeResponse.json();

    // Check if the client wants an image/png response
    const accept = request.headers.get('Accept') || '';
    const downloadParam = url.searchParams.get('download');
    
    if (downloadParam === 'true' || accept.includes('image/png')) {
        // For image download requests, redirect to a popular image conversion service
        // that can convert our SVG to PNG on-the-fly
        const svgUrl = new URL(request.url);
        svgUrl.searchParams.delete('download');
        const encodedSvgUrl = encodeURIComponent(svgUrl.toString());
        
        // Redirect to a service that can convert SVG to PNG
        return Response.redirect(`https://images.weserv.nl/?url=${encodedSvgUrl}&output=png&w=600`, 302);
    }

    // Continue with the existing SVG generation code...
    // Get Pokémon sprite
    const spriteUrl = pokemon.sprites.front_default;
    
    // Format type for rendering
    const formattedTypes = pokemon.types.map(type => ({
        name: type.type.name,
        color: getTypeColor(type.type.name)
    }));
    
    // Get the sprite image data
    const spriteResponse = await fetch(spriteUrl);
    const spriteArrayBuffer = await spriteResponse.arrayBuffer();
    const spriteBase64 = btoa(String.fromCharCode(...new Uint8Array(spriteArrayBuffer)));
    
    // We'll create an SVG image as it's easier to work with in this environment
    const width = 300;
    const height = 400;
    
    // Now create an SVG string (XML-based vector image)
    const svgCard = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <!-- Define styles with web-safe fonts -->
        <defs>
            <style>
                .title {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 20px;
                    font-weight: bold;
                    text-anchor: middle;
                    text-transform: capitalize;
                }
                
                .type-text {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 12px;
                    text-anchor: middle;
                    fill: white;
                    text-transform: capitalize;
                }
                
                .stat-text {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                }
                
                .stat-text-right {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    text-anchor: end;
                }
                
                .footer {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 10px;
                    text-anchor: middle;
                    fill: #666;
                }
            </style>
        </defs>
        
        <!-- Card background -->
        <rect width="${width}" height="${height}" fill="white" />
        
        <!-- Card border -->
        <rect x="5" y="5" width="${width-10}" height="${height-10}" 
              fill="white" stroke="black" stroke-width="2" rx="10" ry="10" />
        
        <!-- Title area -->
        <text x="${width/2}" y="30" class="title">${pokemon.name}</text>
        
        <!-- Types -->
        ${formattedTypes.map((type, i) => {
            const x = width/2 - (formattedTypes.length-1)*40/2 + i*40;
            return `
            <rect x="${x-30}" y="40" width="60" height="20" rx="10" ry="10" fill="${type.color}" />
            <text x="${x}" y="55" class="type-text">${type.name}</text>
            `;
        }).join('')}
        
        <!-- Sprite image (embedded as base64) -->
        <image x="${width/2-75}" y="70" width="150" height="150" 
               href="data:image/png;base64,${spriteBase64}" />
        
        <!-- Stats area -->
        <rect x="20" y="230" width="${width-40}" height="150" fill="#f0f0f0" rx="5" ry="5" />
        
        <!-- Stats text -->
        <text x="40" y="260" class="stat-text">HP: ${pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0}</text>
        <text x="${width-40}" y="260" class="stat-text-right">ATK: ${pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0}</text>
        <text x="40" y="290" class="stat-text">DEF: ${pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0}</text>
        <text x="${width-40}" y="290" class="stat-text-right">SPD: ${pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0}</text>
        
        <!-- Horizontal divider -->
        <line x1="20" y1="305" x2="${width-20}" y2="305" stroke="#ccc" stroke-width="2" />
        
        <!-- Additional info -->
        <text x="40" y="330" class="stat-text">Height: ${pokemon.height/10}m</text>
        <text x="${width-40}" y="330" class="stat-text-right">Weight: ${pokemon.weight/10}kg</text>
        
        <!-- Footer -->
        <text x="${width/2}" y="${height-15}" class="footer">Pokémon Card Generator</text>
    </svg>
    `;
    
    // Return SVG with appropriate headers
    return new Response(svgCard, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600',
            'Content-Disposition': `inline; filename="${pokemon.name}.svg"`
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