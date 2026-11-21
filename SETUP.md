# Local setup

How to run the whole Pragy platform on your own computer: the website, the API and the database. The same guide is in both repositories (`pragy-frontend` and `pragy-backend`).

First time: about 30–45 minutes. Team rules for writing code and changing the database are in `CONTRIBUTING.md`.

```
Browser ──► Website (pragy-frontend, Next.js)     http://localhost:3000
              │  calls to /api/... are forwarded
              ▼
            API (pragy-backend, NestJS)           http://localhost:4000
              │
              ├──► PostgreSQL                     localhost:5432, database "pragy_dev"
              └──► Redis (optional locally; without it, logins are kept in memory)
```

## 1. Install the tools (once per computer)

| Tool | Version | Download |
|---|---|---|
| Git | any recent | git-scm.com |
| Node.js | 22 LTS (at least 20.12) | nodejs.org |
| PostgreSQL | 16, on port **5432** | postgresql.org/download |
| VS Code | optional | code.visualstudio.com |

While installing PostgreSQL, write down the password you choose for the `postgres` user and keep the port at **5432**. If 5432 is already taken, another PostgreSQL is already installed: use that one, or install on 5433 and use that port in `DATABASE_URL` below.

Redis is **not** needed on your computer.

Check the tools:

```bash
node -v
git --version
psql --version
```

If `psql` is not found on Windows, add `C:\Program Files\PostgreSQL\16\bin` to your PATH, or use the "SQL Shell (psql)" app from the Start menu.

## 2. Get the code

Ask the project lead to add your GitHub account to both repositories (they are private).

```bash
mkdir Pragy_Project
cd Pragy_Project
git clone https://github.com/Ayushsahu30/pragy-backend.git
git clone https://github.com/Ayushsahu30/pragy-frontend.git
```

Daily work happens on the `staging` branch (see `CONTRIBUTING.md`):

```bash
cd pragy-backend && git checkout staging && cd ..
cd pragy-frontend && git checkout staging && cd ..
```

## 3. Create the database

```bash
psql -U postgres -c "CREATE DATABASE pragy_dev;"
```

Type the `postgres` password when asked. You should see `CREATE DATABASE`.

## 4. Backend (API)

```bash
cd pragy-backend
npm install
```

Copy `.env.example` to a new file named `.env` in the same folder and set these values:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/pragy_dev
REDIS_URL=
AUTH_SECRET=PASTE_A_RANDOM_SECRET
ALLOW_DEV_LOGIN_CODES=true
COOKIE_SECURE=false
TRUST_PROXY_HOPS=0
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
RESEND_API_KEY=
MAIL_FROM=
MAIL_REPLY_TO=
```

Make the `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

If your password contains special characters such as `@`, `#` or `/`, write them URL-encoded in `DATABASE_URL` (for example `@` becomes `%40`).

Create the tables:

```bash
npx prisma migrate deploy
```

Start the API and leave this terminal open:

```bash
npm run start:dev
```

Open http://localhost:4000/health. It should show `"database":"connected"` and `"sessions":"memory"`.

## 5. Frontend (website)

In a second terminal:

```bash
cd pragy-frontend
npm install
```

Create a file named `.env.local` in the same folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
API_PROXY_TARGET=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start it:

```bash
npm run dev
```

Open http://localhost:3000.

## 6. Check that it all works

1. http://localhost:3000/status says the backend is connected.
2. Log in: open `/login`, type any email (for example `test@example.com`) and click "Send code". The code appears in the **backend terminal** as `Login code for test@example.com: 123456`. Enter it, fill in "Tell us about you", and you land on the dashboard.
3. Make yourself an admin (in `pragy-backend`), then open http://localhost:3000/admin:

   ```bash
   npm run admin:grant -- test@example.com
   ```

4. Run the API tests (in `pragy-backend`, needs the database):

   ```bash
   npm run test:e2e
   ```

## 7. Optional: Google login and real emails

These need keys from the project lead. Get them privately; never paste keys in a chat group, a ticket or a commit.

| Feature | Add to `pragy-backend/.env` |
|---|---|
| Continue with Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google Cloud project "Pragy Website"; the localhost return address is already allowed) |
| Real login emails | `RESEND_API_KEY` and `MAIL_FROM=Pragy <login@acenshun.com>`. Codes are then emailed instead of printed. Leave them empty to keep codes in the terminal. |

Restart the API after changing `.env` (Ctrl+C, then `npm run start:dev`).

## Everyday commands

| Task | Command | Folder |
|---|---|---|
| Start the API | `npm run start:dev` | pragy-backend |
| Start the website | `npm run dev` | pragy-frontend |
| Get the latest code | `git pull` | both |
| After pulling: install new packages | `npm install` | both |
| After pulling: apply new database changes | `npx prisma migrate deploy` | pragy-backend |
| Change the database tables | edit `prisma/schema.prisma`, then `npm run db:migrate -- --name what_changed` | pragy-backend |
| Look at the database in the browser | `npx prisma studio` | pragy-backend |
| Check code style | `npm run lint` | both |

## Common problems

| Problem | Fix |
|---|---|
| `/health` shows `"database":"error"` | PostgreSQL is not running, or the password or database name in `DATABASE_URL` is wrong. |
| `Can't reach database server` | Start the PostgreSQL service (Windows: Services → `postgresql-x64-16` → Start). |
| `port ... already in use` (3000, 4000 or 5432) | Another program or an old terminal is using it. Close it and start again. |
| No login code in the terminal | `RESEND_API_KEY` is set, so codes are emailed. Empty it and restart the API. |
| Website says the backend is "Not reachable" | The API is not running, or `.env.local` has the wrong address. |
| Old pages or pictures after changes | Stop the website, delete the `.next` folder, run `npm run dev` again. |
| Prisma error after `git pull` | Run `npm install` and `npx prisma migrate deploy` in `pragy-backend`. |

## Online environments (for reference)

| | Live | Staging (testing) |
|---|---|---|
| Branch | `main` | `staging` |
| Website | https://acenshun.com | https://staging.acenshun.com (needs a Vercel login) |
| API | Railway, environment "production" | Railway, environment "staging" |
| Database | Real users | Test data only |

Pushing to `staging` updates the staging site; merging into `main` updates the live site. Only the project lead merges into `main`.
