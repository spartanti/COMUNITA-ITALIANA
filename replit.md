# ComunitaES

Site institucional da Associação Federativa Comunità Italiana do Espírito Santo — recriação do WordPress original como aplicação React moderna, com painel de administração completo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/comunitaes run dev` — run the ComunitaES frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (API server + DB migrations)
- Required env: `SESSION_SECRET` — used as JWT secret for admin auth

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Fonts: Raleway (headings) + Open Sans (body) via Google Fonts
- Auth: JWT-based admin auth (bcryptjs + jsonwebtoken)

## Where things live

- `artifacts/comunitaes/` — React frontend (the main site + admin panel)
- `artifacts/comunitaes/src/data/siteData.ts` — static content from WordPress export
- `artifacts/comunitaes/src/pages/` — public pages (Home, QuemSomos, Historia, etc.)
- `artifacts/comunitaes/src/pages/admin/` — admin panel pages
- `artifacts/comunitaes/src/components/admin/` — AdminLayout component
- `artifacts/comunitaes/src/contexts/AdminContext.tsx` — admin auth state
- `artifacts/comunitaes/src/lib/api.ts` — typed API client for admin
- `artifacts/comunitaes/src/components/SEO.tsx` — Google Analytics + SEO meta tags
- `artifacts/api-server/src/routes/` — API routes (auth, posts, banners, settings)
- `artifacts/api-server/src/middlewares/adminAuth.ts` — JWT middleware
- `lib/db/src/schema/` — DB tables: posts, banners, settings
- `attached_assets/wp_export.xml` — original WordPress XML export

## Admin Panel

Access at `/admin/login` with the configured password.

- **Dashboard**: overview of posts and banners
- **Notícias** (`/admin/posts`): create, edit, publish/unpublish, delete posts
- **Banner Principal** (`/admin/banners`): manage hero banner image, title, subtitle, CTAs
- **Configurações** (`/admin/settings`): Google Analytics ID, SEO title/description/keywords, OG image, change admin password

### First-time setup (admin password)

The admin password was configured via POST /api/auth/setup using SESSION_SECRET as the setup key.
Default password set: `ComunitaES@2024` — **change this in Configurações after first login**.

To reset the password manually:
```bash
curl -X POST http://localhost:80/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"password":"NewPassword123","setupKey":"<SESSION_SECRET value>"}'
```

## Architecture decisions

- Frontend-only static content: WordPress posts embedded in `siteData.ts` for fast initial load
- DB-backed dynamic content: new posts/banners/settings stored in PostgreSQL via API
- Hero banner on Home page loads active banner from DB; falls back to WordPress CDN image if none set
- Admin auth: JWT tokens stored in localStorage, verified server-side via `requireAdmin` middleware
- SEO & GA: loaded dynamically from `/api/settings` on app init — no rebuild needed to update
- No Clerk auth (Clerk API was unavailable during setup); using bcrypt + JWT instead

## Product

Multi-page institutional website + admin panel:
- Public: Home (dynamic banner), Quem Somos, História, Notícias (54 static + dynamic), post detail, Transparência, Diretoria, Estatuto, Contato
- Admin: login, dashboard, posts CRUD, banner manager, site settings (SEO + GA4)

## User preferences

- Site in Portuguese (Brazilian)
- Brand colors: primary #1E2D44, accent #03C4EB
- WordPress export at `attached_assets/comunitaes.WordPress.2026-05-26_1779830510643.zip`

## Gotchas

- `siteData.ts` is auto-generated — re-run the extraction script if WordPress content changes
- Logo URL loaded from WordPress CDN — if original site goes down, the logo breaks
- `data/siteData.ts` is large (~300KB) — do not import it in the API server
- Admin password hash stored in `settings` table with key `admin_password_hash`
- DB schema changes: run `pnpm --filter @workspace/db run push` after schema edits

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
