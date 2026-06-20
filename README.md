# Fallbakit — Investor Pitch

Interactive 12-slide investor deck for [Fallbakit](https://fallbakit.com) — local-first AI routing with cloud fallback. Plain HTML/CSS/JS, no build step, themed to match the web app.

**Live:** https://pitch.fallbakit.tanvirmahin.com

## Run locally

It's static — open `index.html`, or serve it:

```sh
python3 -m http.server 8080   # then open http://localhost:8080
```

## Navigate

- `→` `←` (or `Space`, `PageUp/Down`, arrows) to move; `Home`/`End` to jump; `1`–`9` for a slide.
- Click the left/right edges, tap the dots, or swipe on touch.
- `#3` in the URL deep-links to slide 3.
- **Cmd/Ctrl-P → Save as PDF** exports a clean one-slide-per-page deck.

## Edit

| File | What |
|------|------|
| `index.html` | Slide content + inline SVG diagrams (one `<section class="slide">` each). |
| `styles.css` | Theme tokens (top `:root`), slide system, per-slide layouts, print/reduced-motion. |
| `deck.js` | Navigation, stagger reveals, hash deep-link. |
| `assets/` | Logo, favicon, OG image (from the Fallbakit brand kit). |

Content source: `platform/Pitch-Deck-Concept.md` and `platform/About-Fallbakit.md`.

## Deploy

Cloudflare Pages, connected to this repo's `main` branch — **build command: none, output dir: `/`**. Every push auto-deploys. Custom domain `pitch.fallbakit.tanvirmahin.com` gets a free auto-provisioned certificate.
