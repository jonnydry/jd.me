# Quicklinks

A minimal, terminal-style link hub. Cursor dark aesthetic, 3-color palette, mobile-friendly.

## Setup

```bash
npm install
npm run dev
```

## Customize

- **Profile**: Edit `src/config/profile.ts` — name, handle, tagline, epigraph, avatar path
- **Links**: Edit `src/config/links.ts` — add/remove links
- **Avatar**: Replace `public/avatar-placeholder.svg` with your image (or point `avatar` in profile.ts to your file)

## Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Deploy (no config needed)

Or use the CLI: `npx vercel`
