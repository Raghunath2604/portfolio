# Raghunathareddy GR — Cinematic Portfolio

A cinematic, GSAP-driven Next.js portfolio for Raghunathareddy GR, AI/ML Engineer
specializing in MLOps, scalable deployment, and cloud infrastructure.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Main content files

- `data/profile.json` - name, bio, stats, skills, education, projects, and links
- `data/content.json` - section labels, hero pills, and footer copy
- `public/assets/hero-portrait.png` - transparent cutout used in the hero section
- `public/assets/about-portrait.png` - about-section portrait
- `public/assets/footer-portrait.jpeg` - footer portrait
- `public/assets/intro-video.mp4` - **real video with audio** (19.5s): your
  recorded intro clip crossfaded into your recorded climax clip, warm
  color-graded, AI-tool watermark removed from the climax half via `delogo`
- `public/assets/footer-video.mp4` - still a placeholder silent Ken Burns loop on
  your photo; the footer player is hardcoded muted/looping, so audio here would
  never be heard even if added
- `public/assets/education-bg.webp`, `mobile-footer-bg.webp` - abstract placeholder
  graphics; replace with real screenshots anytime
- `public/assets/project-1.png` / `project-2.png` / `project-3.png` - **real
  operations-dashboard screenshots** for your 3 GitHub projects, not placeholders
- `public/assets/project-mlopsdev.png` - real OG banner pulled from your
  MLOps.dev GitHub repo, not a placeholder
- The footer "Certifications" list (`data/profile.json` → `publications`) now
  shows your 8 real credentials with verify links. Two (Databricks, Forage)
  link to the issuer's homepage rather than a specific verify page, since
  those certs didn't have a public verify URL — swap in a real one if you
  find it. Two more (Y Combinator SDE, Infosys DSA) have no certificate image
  on file, so they link to the org's homepage only.

## Known placeholders to revisit

- `lib/siteConfig.js` → `SITE_URL` is a placeholder Vercel domain — update once deployed.
- `public/assets/education-bg.webp`, `mobile-footer-bg.webp`, `project-1/2/3.png` are
  abstract placeholder graphics, not real screenshots — swap in real ones anytime.
- `public/assets/footer-video.mp4` is still the generated silent Ken Burns loop —
  intro-video.mp4 is the one with your real recorded audio/video (intro +
  climax, crossfaded together).

## Micky — the portfolio chatbot

A floating chat widget (bottom-right corner) lets visitors ask about your
projects, skills, and certifications. It's powered by the Gemini API.

**Setup:**
1. Your key is already in `.env.local` (gitignored, local-only).
   `.env.local.example` is the template if you ever need to reset it.
2. `npm run dev` and click the chat bubble, bottom-right, to try it.

**Important — read before deploying:**
- The Gemini key lives in `app/api/chat/route.js`, read from the
  `GEMINI_API_KEY` environment variable **on the server only**. It is never
  sent to the browser.
- **When you deploy (e.g. to Vercel), you must add `GEMINI_API_KEY` as an
  Environment Variable in that platform's dashboard.** `.env.local` only
  works for local development — it doesn't get uploaded anywhere.
- I could not fully test the live Gemini call from my end (sandboxed
  environment, no outbound access to Google's API). I confirmed the route
  correctly validates input and handles errors, but **please test an actual
  conversation yourself** after `npm run dev`, and again after deploying.
- I found one report online of Gemini's `generateContent` endpoint returning
  403 from certain cloud-hosting IP ranges while working fine from a home
  connection. I don't know if this affects Vercel or if it's been fixed —
  but if chat works locally and fails only after deploying, check this first.
- Micky answers only from `data/profile.json` — it won't invent projects or
  experience that aren't listed there. Edit that file and its answers update.
- There's no rate-limiting beyond basic input-length checks. Fine for normal
  personal-site traffic; add real rate-limiting (Vercel's or Upstash's) if
  this page ever gets heavy or bot traffic.
- **Security reminder:** you pasted your API key directly into our chat. If
  you're at all unsure who might see that conversation, regenerate the key
  at https://aistudio.google.com/apikey and update `.env.local` plus your
  Vercel environment variable with the new one.

## Hero section video (update)

The Hero section's right-side photo is now a **looping muted video**
(`public/assets/hero-video.mp4`) instead of a static transparent-cutout
photo. This is a real design trade-off worth knowing:

- **Old behavior:** a transparent PNG cutout of you, floating directly on
  the hero's gradient background (no visible rectangle/edges).
- **New behavior:** a normal rectangular video panel with its own
  background scene (campus → office walk), filling the same space via
  `object-fit: cover`. It no longer "floats" on the gradient — it's a
  solid video panel, since the source footage isn't transparent.

AI-tool watermark removed via `delogo` (near-perfect on the grass/flat-panel
shots, a faint soft-blur trace remains in two frames over a busy textured
background — much less noticeable than the original mark, not pixel-perfect).
Warm color grade applied to match the rest of the site. Audio stripped
(silent background loop, autoplay/loop/muted). Fades to/from black at the
very start/end so the loop doesn't hard jump-cut between the campus and
office shots.
