# pragy-frontend

The website for the Pragy platform: landing page, sales pages, login, members area and admin panel. Built with Next.js 16, TypeScript and Tailwind CSS.

The API lives in a separate repository, `pragy-backend`.

- **Full setup** (website, API and database on your computer): `SETUP.md`
- **Team rules** (branches, commits, design and code): `CONTRIBUTING.md`

## Run it locally

Requires Node.js 22 (at least 20.12) and the API from `pragy-backend` running on port 4000.

```bash
npm install
```

Create `.env.local` (see `.env.example`), then:

```bash
npm run dev
```

The website runs on http://localhost:3000. http://localhost:3000/status shows whether it can reach the API.

## Environment variables

| Name | What it is |
|---|---|
| `NEXT_PUBLIC_API_URL` | Address of the API, without a slash at the end. Locally `http://localhost:4000`. |
| `API_PROXY_TARGET` | Where `/api/...` calls are forwarded. Defaults to `NEXT_PUBLIC_API_URL`. On Vercel it points the staging site at the staging API. |
| `NEXT_PUBLIC_SITE_URL` | Public address of this website, without a slash at the end. Used for link previews. Locally `http://localhost:3000`; live `https://acenshun.com`. On the live site it also sends visitors of the old `pragy-frontend-zeta.vercel.app` address to it. |

Variables starting with `NEXT_PUBLIC_` are visible in the browser, so never put a secret in one. Add every new variable to `.env.example` and to this table.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Run locally and refresh on every change |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check code style |

## Folder structure

```
src/app/(site)/      Public pages, with the site header and footer
src/app/(auth)/      /login, /signup, /welcome
src/app/(account)/   /dashboard, /admin
src/components/      Pieces of the interface (ui.tsx holds the shared ones)
src/content/         Text, prices and lists shown on the site
src/lib/             API calls, login state and formatting helpers
public/images/       Photos
```

## Deploying

Vercel builds every push:

| Branch | Address | Vercel environment |
|---|---|---|
| `main` | https://acenshun.com | Production |
| `staging` | https://staging.acenshun.com (needs a Vercel login) | Preview, branch `staging` |

The build command is `npm run build`. Only the live site may be listed by search engines; every other copy sends `X-Robots-Tag: noindex`.

`AGENTS.md` is created by Next.js for AI coding tools. Leave it in place.
