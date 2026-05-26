# ComunitaES

Site institucional da Associação Federativa Comunità Italiana do Espírito Santo — recriação do WordPress original como aplicação React moderna.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/comunitaes run dev` — run the ComunitaES frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (API server only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Fonts: Raleway (headings) + Open Sans (body) via Google Fonts

## Where things live

- `artifacts/comunitaes/` — React frontend (the main site)
- `artifacts/comunitaes/src/data/siteData.ts` — all content (auto-generated from WordPress XML export)
- `artifacts/comunitaes/src/pages/` — all pages (Home, QuemSomos, Historia, Noticias, PostDetail, Transparencia, Diretoria, Estatuto, Contato)
- `artifacts/comunitaes/src/components/layout/` — Navbar, Footer, Layout
- `attached_assets/wp_export.xml` — original WordPress XML export
- `attached_assets/site_content.json` — processed site content

## Architecture decisions

- Frontend-only: all content from WordPress export is embedded as static TypeScript data in `siteData.ts` — no CMS or database required for the frontend
- Content was extracted from the WordPress XML export and cleaned (HTML stripped, spam posts filtered)
- Logo and hero images are loaded from the live WordPress site CDN
- No authentication required — public institutional site

## Product

Multi-page institutional website for ComunitaES with: Home with hero + news grid, Quem Somos, História da Imigração Italiana, Notícias (54 posts, paginated, filterable by category), post detail pages, Transparência, Diretoria, Estatuto, and Contato form.

## User preferences

- Site in Portuguese (Brazilian)
- Brand colors: primary #1E2D44, accent #03C4EB
- WordPress export at `attached_assets/comunitaes.WordPress.2026-05-26_1779830510643.zip`

## Gotchas

- `siteData.ts` is auto-generated — re-run the extraction script if WordPress content changes
- Logo URL is loaded from the live WordPress CDN; if the original site goes down, the logo will break
- The `data/siteData.ts` file is large (~300KB) — do not import it in the API server

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
