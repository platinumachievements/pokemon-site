/**
 * Fits text within a bounded area with smart line breaking and font sizing
 * @param {Object} options Configuration options
 * @param {string} options.text The text to fit
 * @param {number} options.x X coordinate (center point of text)
 * @param {number} options.y Y coordinate (center point of text)
 * @param {number} options.boxWidth Maximum width for the text
 * @param {number} options.boxHeight Maximum height for the text
 * @param {number} [options.maxFontSize=48] Maximum font size to use
 * @param {number} [options.minLineSize=20] Minimum font size before splitting into lines
 * @param {number} [options.maxLines=2] Maximum number of lines to split text into
 * @param {string} [options.textClass=''] CSS class for the text element
 * @param {string} [options.fontFamily='Arial, Helvetica, sans-serif'] Font family
 * @param {string} [options.fill=''] Text color (will use CSS if not provided)
 * @param {string} [options.textAnchor='middle'] Text anchor (start, middle, end)
 * @returns {string} SVG text element with proper sizing and positioning
 */
export function fitText({
    text,
    x,
    y,
    boxWidth,
    boxHeight,
    maxFontSize = 48,
    minLineSize = 20,
    maxLines = 2,
    textClass = '',
    fontFamily = 'Arial, Helvetica, sans-serif',
    fill = '',
    textAnchor = 'middle'
}) {
    // Start with maximum font size
    let fontSize = maxFontSize;
    let lines = [text];
    
    // Calculate approximate character width based on font size
    const getCharWidth = (size) => size * 0.6;
    const getLineHeight = (size) => size * 1.2;
    
    // Helper to check if text fits in a single line
    const fitsInOneLine = (text, size) => {
        return text.length * getCharWidth(size) <= boxWidth;
    };
    
    // Calculate and split text into lines if needed
    const calculateLines = () => {
        // If text fits with current font size, keep it as one line
        if (fitsInOneLine(text, fontSize) || fontSize <= minLineSize) {
            return [text];
        }
        
        // If we need to split into lines
        const words = text.split(' ');
        const result = [];
        let currentLine = [];
        let currentWidth = 0;
        const maxCharsPerLine = Math.floor(boxWidth / getCharWidth(fontSize));
        
        for (const word of words) {
            const wordWidth = word.length * getCharWidth(fontSize);
            
            if (currentWidth + wordWidth > boxWidth) {
                if (currentLine.length > 0) {
                    result.push(currentLine.join(' '));
                    currentLine = [word];
                    currentWidth = wordWidth;
                } else {
                    // Word is too long for a line, must push it anyway
                    result.push(word);
                    currentLine = [];
                    currentWidth = 0;
                }
            } else {
                currentLine.push(word);
                currentWidth += wordWidth + getCharWidth(fontSize); // Add space width
            }
            
            // If we've reached max lines, join remaining words and break
            if (result.length === maxLines - 1 && currentLine.length > 0) {
                result.push(currentLine.join(' '));
                break;
            }
        }
        
        // Add last line if not already added
        if (currentLine.length > 0 && result.length < maxLines) {
            result.push(currentLine.join(' '));
        }
        
        // Truncate if we have more lines than allowed
        if (result.length > maxLines) {
            result.length = maxLines;
            const lastLine = result[maxLines - 1];
            result[maxLines - 1] = lastLine.length > 3 
                ? lastLine.slice(0, maxCharsPerLine - 3) + '...' 
                : lastLine;
        }
        
        return result;
    };
    
    // Calculate if the entire text block fits in the box height
    const fitsInHeight = (lines, size) => {
        const totalHeight = lines.length * getLineHeight(size);
        return totalHeight <= boxHeight;
    };
    
    // Binary search to find optimal font size
    while (fontSize > 8) { // Don't go smaller than 8px
        lines = calculateLines();
        
        if (fitsInHeight(lines, fontSize)) {
            // If all lines fit in single line or we have correct number of lines
            if ((lines.length === 1 && fitsInOneLine(text, fontSize)) || 
                (lines.length <= maxLines)) {
                break;
            }
        }
        
        // Reduce font size and try again
        fontSize -= 2;
    }
    
    // Calculate line height and starting y position
    const lineHeight = getLineHeight(fontSize);
    const startY = y - ((lines.length - 1) * lineHeight / 2);
    
    // Create SVG text element
    let textAttributes = `x="${x}" font-family="${fontFamily}" font-size="${fontSize}" text-anchor="${textAnchor}"`;
    
    if (textClass) {
        textAttributes += ` class="${textClass}"`;
    }
    
    if (fill) {
        textAttributes += ` fill="${fill}"`;
    }
    
    let svgText = `<text ${textAttributes}>`;
    
    // Add each line as a tspan
    lines.forEach((line, index) => {
        const lineY = startY + (index * lineHeight);
        svgText += `<tspan x="${x}" y="${lineY}">${line}</tspan>`;
    });
    
    svgText += '</text>';
    return svgText;
}