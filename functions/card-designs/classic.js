import { fitText } from '../utils/textfit.js';

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
                    font-weight: bold;
                    text-transform: capitalize;
                }
                
                .type-text {
                    font-family: Arial, Helvetica, sans-serif;
                    text-anchor: middle;
                    fill: white;
                    text-transform: capitalize;
                }
                
                .stat-text {
                    font-family: Arial, Helvetica, sans-serif;
                }
                
                .stat-text-right {
                    font-family: Arial, Helvetica, sans-serif;
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
        
        <!-- Title area using fitText -->
        ${fitText({
            text: pokemon.name,
            x: width/2,
            y: 30,
            boxWidth: width - 40,
            boxHeight: 30,
            maxFontSize: 20,
            textClass: 'title'
        })}
        
        <!-- Types -->
        ${formattedTypes.map((type, i) => {
            const x = width/2 - (formattedTypes.length-1)*40/2 + i*40;
            return `
            <rect x="${x-30}" y="40" width="60" height="20" rx="10" ry="10" fill="${type.color}" />
            <text x="${x}" y="55" class="type-text" font-size="12px">${type.name}</text>
            `;
        }).join('')}
        
        <!-- Sprite image (embedded as base64) -->
        <image x="${width/2-75}" y="70" width="150" height="150" 
               href="data:image/png;base64,${spriteBase64}" />
        
        <!-- Stats area -->
        <rect x="20" y="230" width="${width-40}" height="150" fill="#f0f0f0" rx="5" ry="5" />
        
        <!-- Stats text using fitText -->
        ${fitText({
            text: `HP: ${pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0}`,
            x: 40,
            y: 260,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'start',
            textClass: 'stat-text'
        })}
        
        ${fitText({
            text: `ATK: ${pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0}`,
            x: width-40,
            y: 260,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'end',
            textClass: 'stat-text-right'
        })}
        
        ${fitText({
            text: `DEF: ${pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0}`,
            x: 40,
            y: 290,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'start',
            textClass: 'stat-text'
        })}
        
        ${fitText({
            text: `SPD: ${pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0}`,
            x: width-40,
            y: 290,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'end',
            textClass: 'stat-text-right'
        })}
        
        <!-- Horizontal divider -->
        <line x1="20" y1="305" x2="${width-20}" y2="305" stroke="#ccc" stroke-width="2" />
        
        <!-- Additional info using fitText -->
        ${fitText({
            text: `Height: ${pokemon.height/10}m`,
            x: 40,
            y: 330,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'start',
            textClass: 'stat-text'
        })}
        
        ${fitText({
            text: `Weight: ${pokemon.weight/10}kg`,
            x: width-40,
            y: 330,
            boxWidth: 100,
            boxHeight: 30,
            maxFontSize: 14,
            textAnchor: 'end',
            textClass: 'stat-text-right'
        })}
        
        <!-- Footer -->
        <text x="${width/2}" y="${height-15}" class="footer">Pokémon Card Generator</text>
    </svg>
    `;
} 