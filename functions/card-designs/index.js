import { generateClassicDesign } from './classic.js';
import { generateModernDesign } from './modern.js';

// Export all designs
export const designs = {
    classic: generateClassicDesign,
    modern: generateModernDesign
};

/**
 * Get a random design function from the available designs
 * @param {string} [designName] - Specific design to use (optional)
 * @returns {Function} A card design generation function
 */
export function getRandomDesign(designName) {
    // If a specific design is requested and exists, return it
    if (designName && designs[designName]) {
        return designs[designName];
    }
    
    // Otherwise pick a random design
    const designNames = Object.keys(designs);
    const randomIndex = Math.floor(Math.random() * designNames.length);
    return designs[designNames[randomIndex]];
}

/**
 * Get a specific design function by name
 * @param {string} designName - Name of the design to retrieve
 * @returns {Function} The requested design function or the classic design if not found
 */
export function getDesign(designName) {
    return designs[designName] || designs.classic;
} 