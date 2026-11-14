# pragy-frontend

The website for the Pragy platform: landing page, sales pages, members area and admin panel. Built with Next.js, TypeScript and Tailwind CSS.

The API lives in a separate repository, `pragy-backend`.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
```

Copy `.env.example` to `.env.local`, then:

```bash
npm run dev
```

The website runs on http://localhost:3000. Start `pragy-backend` too, or the setup check on the home page will show "Not reachable".

## Environment variables

| Name | What it is |
|---|---|
| `NEXT_PUBLIC_API_URL` | Address of the backend API, without a slash at the end. |

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
src/app/          Pages (one folder per page address)
src/components/   Reusable pieces of the interface
src/lib/          Shared helpers and settings
public/           Images and other static files
```

## Deploying

Set `NEXT_PUBLIC_API_URL` to the live backend address in the hosting dashboard. The build command is `npm run build`.

`AGENTS.md` is created by Next.js for AI coding tools. Leave it in place.
