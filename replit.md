# AI Software Factory

A Next.js 16 web application for an AI-powered software development platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js 20

## Project Structure

```
app/
  layout.tsx     - Root layout with metadata and fonts
  page.tsx       - Landing page
  globals.css    - Global styles
public/          - Static assets
next.config.ts   - Next.js configuration (allowedDevOrigins: ["*"])
package.json     - Dependencies and scripts
tsconfig.json    - TypeScript config
```

## Development

The app runs on port 5000 at host 0.0.0.0 for Replit compatibility:

```bash
npm run dev
```

## Deployment

- **Target**: Autoscale
- **Build**: `npm run build`
- **Run**: `npm run start` (port 5000)

## Configuration Notes

- `allowedDevOrigins: ["*"]` in `next.config.ts` ensures the app works in Replit's proxy iframe
- Dev server binds to `0.0.0.0:5000` for Replit preview compatibility
