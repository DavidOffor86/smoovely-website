# Smoovely QuickMove — Deployment & Operations Guide

Production stack: **Next.js 16** (App Router) → **Vercel** (recommended host) →
domains **smoovelylogistics.com** (primary) + **smoovelylogistics.co.uk** (redirect).

---

## 1. Deployment steps (quick path)

```bash
# from project root: c:\Users\demza\Documents\quick move\quickmove
npm install          # install deps
npm run build        # production build — must pass with no errors
npm run start        # optional: preview the production build locally on :3000
```

Then deploy via Git (see §2) or the Vercel CLI:

```bash
npm i -g vercel
vercel               # first run links/creates the project (preview deploy)
vercel --prod        # promote to production
```

**Build checklist**
- `npm run build` completes cleanly.
- Images live in `/public/images` and load (already verified).
- Environment variables set in the host (see §3 and `.env.example`).

---

## 2. Hosting + post-launch workflow (Git-based, recommended)

**Why Vercel:** zero-config for Next.js, free SSL, global CDN (fast loads),
automatic redeploys on `git push`. Netlify and Azure Static Web Apps also work;
Vercel is the simplest + most scalable for this app.

### One-time setup
1. Push this repo to GitHub (private is fine):
   ```bash
   git init
   git add .
   git commit -m "Production-ready QuickMove site"
   git branch -M main
   git remote add origin https://github.com/<you>/quickmove.git
   git push -u origin main
   ```
2. In **vercel.com → Add New Project → Import** the GitHub repo.
3. Framework preset auto-detects **Next.js**. Build command `next build`,
   output handled automatically. Click **Deploy**.

### Continuous editing after launch
- `main` branch = **production**. Every push to `main` auto-redeploys live.
- Any other branch / pull request = **preview URL** (test before going live).

Day-to-day:
```bash
# edit locally
npm run dev                     # http://localhost:3000
git add -A
git commit -m "Describe change"
git push                        # → Vercel builds & deploys automatically
```
Changes go live in ~1–2 minutes. If a deploy looks wrong, use **Vercel →
Deployments → Promote** to instantly roll back to a previous good build.

---

## 3. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**
(and in a local `.env.local`, copied from `.env.example`):

| Variable | Purpose |
|---|---|
| `POWER_AUTOMATE_WEBHOOK_URL` | Receives each quote submission (see §5) |
| `MAINTENANCE_MODE` | `true` = whole site shows Under Construction |
| `MAINTENANCE_PATHS` | Optional: `/quote,/careers` to take only those offline |
| `RESEND_API_KEY` / `NOTIFY_EMAIL` | Optional direct email alerts (else Power Automate emails) |

After changing an env var in Vercel, **redeploy** for it to take effect.
Never commit `.env.local`; it is gitignored. Only `.env.example` is committed.

---

## 4. Domains + SSL

In **Vercel → Project → Settings → Domains**:

1. Add `smoovelylogistics.com` → set as **Primary**.
2. Add `www.smoovelylogistics.com` → redirect to apex (Vercel offers this).
3. Add `smoovelylogistics.co.uk` → choose **Redirect to `smoovelylogistics.com`**
   (308). This makes `.com` canonical and `.co.uk` forward to it.
4. At each **registrar**, point DNS at Vercel:
   - A record `@` → `76.76.21.21`, **or** the registrar's ALIAS/ANAME to
     `cname.vercel-dns.com`.
   - CNAME `www` → `cname.vercel-dns.com`.
   - Repeat for the `.co.uk` registrar.
5. **SSL/HTTPS** is automatic — Vercel issues + renews Let's Encrypt certs for
   every domain once DNS verifies. HTTPS + HTTP→HTTPS redirect are on by default.

DNS propagation: usually minutes, up to 24–48h worst case.

---

## 5. Quote configurator → Microsoft Forms / Power Automate integration

The app already sends every completed quote to **`POST /api/quote`**
(`src/app/api/quote/route.js`). That endpoint forwards a flat, CSV-ready record
to `POWER_AUTOMATE_WEBHOOK_URL`. You build the Power Automate flow once:

### JSON payload sent to the webhook
```json
{
  "timestamp": "2026-06-13T10:32:00.000Z",
  "service": "Home Removals",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "07700 900123",
  "estimate": 250,
  "currency": "GBP",
  "details_summary": "pickupPostcode: SE10 9AB · property: 3 Bedroom Property · load: Full Load",
  "details": { "...": "full structured answers" }
}
```

### Power Automate flow (preferred — Excel row + email)
1. **flow.microsoft.com → Create → Instant cloud flow → "When an HTTP request
   is received"**. Paste the schema above into *Use sample payload to generate
   schema*. Save → copy the generated **HTTP POST URL** → put it in
   `POWER_AUTOMATE_WEBHOOK_URL`.
2. Add **Excel Online (Business) → Add a row into a table** (a workbook in
   SharePoint/OneDrive with columns: Timestamp, Service, Name, Email, Phone,
   Estimate, Currency, Details). Map each field from the trigger body. This Excel
   table **is your CSV** — *File → Save As / Export → .csv* anytime, and it is the
   Microsoft 365 equivalent of a Forms response sheet.
3. Add **Office 365 Outlook → Send an email (V2)** to the team inbox with the
   submission details (the follow-up notification trigger).
4. (Optional) Add **Microsoft Teams → Post message** for an instant internal alert.

### Alternatives
- **Webhook only:** point `POWER_AUTOMATE_WEBHOOK_URL` at any endpoint (Zapier,
  Make, your CRM) — same payload.
- **Direct email:** set `RESEND_API_KEY` + `NOTIFY_EMAIL` and the API emails the
  team directly (works with or without Power Automate).

Local dev with no webhook set still succeeds — the record is logged to the
server console so nothing is lost while testing.

---

## 6. Maintenance / Under Construction mode

Controlled by env vars (`src/middleware.js` + `src/app/maintenance/page.js`):

- **Whole site offline:** set `MAINTENANCE_MODE=true` → redeploy (or just change
  the var in Vercel and redeploy). Every visitor sees
  *"We're currently making improvements. Please check back shortly."* (HTTP 503,
  so search rankings are preserved). Set back to `false` to restore.
- **Specific pages only:** leave `MAINTENANCE_MODE=false` and set
  `MAINTENANCE_PATHS=/quote,/careers`. Only those routes show the page.

Static assets, images and API routes stay reachable so the page renders cleanly.

---

## 7. Performance & mobile

- Vercel CDN + `next build` give fast first loads and HTTP/2.
- Security headers are set in `next.config.mjs`.
- Layouts are mobile-first (Tailwind `sm:`/`lg:` breakpoints), the navbar has a
  dedicated mobile menu, CTAs use ≥44px touch targets, and `overflow-x-hidden`
  guards against sideways scroll.

**Optional future optimisation:** the site uses plain `<img>` tags. Migrating
high-traffic images (hero, service cards) to `next/image` would add automatic
resizing/WebP and lazy loading. Not required for launch; do it incrementally.
