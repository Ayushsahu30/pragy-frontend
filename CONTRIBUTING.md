# Team rules

How we write code in `pragy-frontend`. The first part is the same in both repositories; the second part is only for the website. Setup steps are in `SETUP.md`.

---

## Part 1: Rules for both repositories

### Branches and going live

| Branch | Deploys to | Who pushes |
|---|---|---|
| `staging` | Test site: staging.acenshun.com | The developer, directly |
| `main` | Live site: acenshun.com | Only the project lead, by merging `staging` |

1. Before starting, get the latest `staging`:

   ```bash
   git checkout staging
   git pull
   ```

2. Work and commit directly on `staging`. Push when a step is finished and working:

   ```bash
   git push
   ```

   If the push is refused because `staging` changed on GitHub, run `git pull` first, fix any conflicts, then push again.
3. Each push updates staging.acenshun.com within a few minutes. Test the change there.
4. Tell the project lead what is ready. When staging works, the lead merges `staging` into `main`, and the live site updates.

Never push to `main`. Never test on the live site.

For a big or risky change that takes several days, you may work on your own branch (`git checkout -b feature/short-name`) and merge it into `staging` when it works, so `staging` stays usable in between.

### Commit messages

- **One line only**, no description underneath.
- Say what the change does, starting with a verb: `Add webinar checkout page`, `Fix phone number check for UAE numbers`.
- No "Co-Authored-By" lines or other tool or AI signatures.
- One commit per finished step. Do not commit code that does not build.

### Before pushing to `staging`

- [ ] `npm run lint` shows no errors
- [ ] `npm run build` works
- [ ] Backend: `npm run test:e2e` passes, and new features have tests
- [ ] You tried the change yourself in the browser (frontend) or with the tests (backend)
- [ ] New settings are added to `.env.example` and the README, without real values
- [ ] Database changes come with a migration (see Part 2)

### Secrets and personal data

- Keys, passwords and database addresses go **only** in `.env` / `.env.local` (never committed) and in the Railway and Vercel dashboards.
- Never paste a key, password or database address in chat, an issue, a pull request, a screenshot or a commit. If it happens, tell the project lead so the key can be replaced.
- Use test emails such as `test@example.com` locally and on staging. Do not copy real users' data to your computer.
- Never send customer emails or phone numbers to outside tools or services.

### Writing style for anything users read

- Plain, short English. The site speaks as Pragy, in the first person ("I help people…").
- Error messages say what to do next: "Please wait 30 seconds before asking for a new code."
- Keep the client's own wording for his text. Ask before rewriting it.

---

## Part 2: Frontend rules

### How the code is organised

```
src/app/(site)/        Public pages, with the site header and footer
src/app/(auth)/        Login, sign-up and the "Tell us about you" step (split-screen layout)
src/app/(account)/     Logged-in pages: /dashboard, /admin
src/components/ui.tsx  Shared pieces: buttons, Section, Eyebrow, Photo
src/components/<area>/ Pieces for one area: landing, auth, account, admin, layout
src/content/           All text, prices and lists shown on the site
src/lib/               Talking to the API (auth.ts, admin.ts), the login state (session.ts), formatting
public/images/         Photos used on the site
```

The folder names in brackets group pages without changing the address: `src/app/(site)/webinar/page.tsx` is `/webinar`.

### Design rules

- **Keep the current look** (the "Version D" design): cream and white backgrounds, dark brown, peach and rust accents, Cormorant Garamond for headings and DM Sans for text. Do not add new colours, fonts or layouts without the project lead's approval.
- Use the colour names from `src/app/globals.css` (`bg-ink`, `bg-cream`, `bg-peach`, `text-rust`, `border-line`…), never new hex codes.
- Use the shared pieces before writing new ones: `ButtonLink` / `buttonClass` for buttons, `Section`, `Eyebrow`, `sectionTitleClass` and `Photo`.
- **Mobile first.** Most visitors come from Instagram on a phone. Check every change at 375 px wide and on a laptop.
- Buttons and links are at least 44 px tall so they are easy to tap.

### Text, prices and photos

- **Text lives in `src/content/`**, not inside components: `site.ts` (contacts, links, details), `products.ts` (sales pages), `prices.ts` (every price), `countries.ts` (phone codes).
- **Every price comes from `src/content/prices.ts`**, shown with `formatINR` / `formatPrice`. Never type a price into a page. (The backend decides the real amount charged; these are only for display.)
- Use the client's own words. The site speaks as Pragy in the first person.
- Photos go in `public/images/`, named by what they show (`result-gaurav-after.jpg`), resized to at most 2000 px wide and compressed (aim for under 300 KB). Show them with the `Photo` component (Next.js image), never a plain `<img>`.
- Every photo has a short `alt` text that describes it.
- Before/after photos of clients are only used with their consent.

### Talking to the backend

- The browser only calls `/api/...` on the website itself; Next.js forwards it to the backend. Never call the Railway address from the browser.
- Use the helpers in `src/lib/` (`authApi`, `adminApi`, or `call()` for new routes). They turn errors into `ApiError` with a message you can show as it is.
- Who is logged in: `useSession()` from `src/lib/session.ts`. After login use `setSignedIn(user)`, to log out `signOut()`.
- **Hiding something on screen is not security.** The backend checks every request; the website only makes it look right.
- Variables that start with `NEXT_PUBLIC_` are visible to everyone. Never put a key or secret in one.

### Pages

- Every page sets a `title` and `description` in its `metadata`. Private pages (account, admin, login) also set `robots: { index: false }`.
- Logged-in pages send logged-out visitors to `/login?next=<this page>`, so they come back after logging in.
- Use `"use client"` only for components that need clicks, typing or the login state. Keep the rest as server components.

### Next.js 16 points to know

- This project uses Next.js 16, which changed several things. Read `AGENTS.md`, and the guides in `node_modules/next/dist/docs/` before using a Next.js feature you have not used here before.
- A component that uses `useSearchParams()` must sit inside `<Suspense>`.
- Next.js keeps pages you have left **alive in the background**, so going back is instant. Their state (form steps, "busy" flags) is still there when the visitor returns. Reset forms after they finish, as `AuthFlow` does after a successful login.

### Accessibility

- Every input has a visible `<label>`. Error messages use `role="alert"`.
- Everything works with the keyboard and shows a visible focus outline.
- Text has enough contrast against its background (follow the existing colour pairs).

### Settings

Every new setting is added to `.env.example` (without a real value) and to the settings table in `README.md`, and the project lead sets it on Vercel: **Production** for the live site, **Preview → branch `staging`** for the test site.
