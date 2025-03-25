import { fitText } from '../utils/textfit.js';

export function generateModernDesign(pokemon, spriteBase64, formattedTypes) {
    const width = 300;
    const height = 400;
    
    // Get the primary type for the card's gradient background
    const primaryType = formattedTypes[0];
    const secondaryColor = formattedTypes.length > 1 
        ? formattedTypes[1].color 
        : lightenColor(primaryType.color, 30);
    
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <!-- Define styles with web-safe fonts -->
        <defs>
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${primaryType.color};stop-opacity:0.7" />
                <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:0.7" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#000" flood-opacity="0.3"/>
            </filter>
            <style>
                .title {
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: bold;
                    fill: white;
                    text-transform: capitalize;
                    filter: url(#shadow);
                }
                
                .type-badge {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 12px;
                    text-anchor: middle;
                    fill: white;
                    text-transform: capitalize;
                }
                
                .stat-text {
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: bold;
                    filter: url(#shadow);
                }
                
                .value {
                    font-family: Arial, Helvetica, sans-serif;
                    fill: white;
                    text-anchor: middle;
                }
                
                .footer {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 10px;
                    text-anchor: middle;
                    fill: white;
                    filter: url(#shadow);
                }
            </style>
        </defs>
        
        <!-- Card background with gradient -->
        <rect width="${width}" height="${height}" fill="url(#cardGradient)" rx="15" ry="15" />
        
        <!-- Pokemon name with drop shadow using fitText -->
        ${fitText({
            text: pokemon.name,
            x: width/2,
            y: 40,
            boxWidth: width - 40,
            boxHeight: 40,
            maxFontSize: 24,
            textClass: 'title'
        })}
        
        <!-- Sprite with circular background -->
        <circle cx="${width/2}" cy="130" r="90" fill="white" fill-opacity="0.3" />
        <image x="${width/2-75}" y="55" width="150" height="150" 
               href="data:image/png;base64,${spriteBase64}" />
        
        <!-- Types as badges -->
        <g transform="translate(${width/2}, 195)">
            ${formattedTypes.map((type, i, arr) => {
                const offset = (i - (arr.length - 1) / 2) * 70;
                return `
                <circle cx="${offset}" cy="0" r="25" fill="${type.color}" />
                <text x="${offset}" y="5" class="type-badge">${type.name}</text>
                `;
            }).join('')}
        </g>
        
        <!-- Stats as circular gauges with fitText -->
        <g transform="translate(50, 270)">
            <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.2)" />
            ${fitText({
                text: "HP",
                x: 0,
                y: -10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 14,
                textClass: 'stat-text',
                fill: 'white'
            })}
            ${fitText({
                text: `${pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0}`,
                x: 0,
                y: 10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 16,
                textClass: 'value'
            })}
        </g>
        
        <g transform="translate(150, 270)">
            <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.2)" />
            ${fitText({
                text: "ATK",
                x: 0,
                y: -10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 14,
                textClass: 'stat-text',
                fill: 'white'
            })}
            ${fitText({
                text: `${pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0}`,
                x: 0,
                y: 10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 16,
                textClass: 'value'
            })}
        </g>
        
        <g transform="translate(250, 270)">
            <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.2)" />
            ${fitText({
                text: "DEF",
                x: 0,
                y: -10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 14,
                textClass: 'stat-text',
                fill: 'white'
            })}
            ${fitText({
                text: `${pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0}`,
                x: 0,
                y: 10,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 16,
                textClass: 'value'
            })}
        </g>
        
        <!-- Additional info with icons using fitText -->
        <g transform="translate(80, 340)">
            <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.2)" />
            ${fitText({
                text: `${pokemon.height/10}m`,
                x: 0,
                y: 5,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 12,
                textClass: 'value'
            })}
        </g>
        
        <g transform="translate(220, 340)">
            <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.2)" />
            ${fitText({
                text: `${pokemon.weight/10}kg`,
                x: 0,
                y: 5,
                boxWidth: 40,
                boxHeight: 20,
                maxFontSize: 12,
                textClass: 'value'
            })}
        </g>
        
        <!-- Footer -->
        <text x="${width/2}" y="${height-15}" class="footer">Pokémon Card Generator</text>
    </svg>
    `;
}

// Helper function to lighten a color for gradient
function lightenColor(hex, percent) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 