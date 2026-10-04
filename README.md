# Spam's Pantry

A family recipe book with ingredient matching, ratings, and scalable servings.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The source is organized under `src/`:

- `src/js/app.js` contains UI behavior.
- `src/js/recipes.js` contains recipe data.
- `src/styles/` contains the stylesheets.
- `src/assets/images/` contains recipe images.

GitHub Actions builds the site and deploys the generated `dist/` directory to GitHub Pages on every push to `main`.
