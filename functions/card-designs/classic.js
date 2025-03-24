export function generateClassicDesign(pokemon, spriteBase64, formattedTypes) {
    const width = 300;
    const height = 400;
    
    return `
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
} 