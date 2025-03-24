# Pokémon Card Generator

A simple web application that generates Pokémon trading cards using the PokeAPI and SVG rendering.

## Features

- Search for Pokémon by name
- View a beautifully rendered SVG card with Pokémon information
- Download cards as SVG or PNG
- Browse Pokémon by type

## Development

### Prerequisites

- Node.js (v14+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pokemon-site.git
cd pokemon-site

# Install dependencies
npm install
```

### Local Development

```bash
# Build the application
npm run build

# Serve the files locally (if you have a local server like http-server)
npx http-server dist
```

## Deployment

This project is configured for deployment on Cloudflare Pages.

### Important Notes

1. The build script copies the static files (HTML, CSS, JS) to the dist directory and then builds the serverless function.
2. Always run `npm run build` before deploying manually.
3. When deploying to Cloudflare Pages, set the build command to `npm run build` and the output directory to `dist`.

## Project Structure

- `functions/` - Cloudflare Functions (serverless)
  - `pokemon.js` - API handler that generates SVG cards
- `index.html` - Main search page
- `list.html` - Type browsing page
- `script.js` - Client-side JavaScript
- `styles.css` - Styling for the application
- `dist/` - Built files (generated, not in Git)

## License

MIT 