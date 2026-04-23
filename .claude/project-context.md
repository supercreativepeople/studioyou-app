# StudioYou — Project Context

## What It Is

StudioYou is an AI-powered creator platform that helps content creators build and grow their independent studios. The core concept is **FutureYou** — an AI guide trained on each creator's unique journey, goals, and data through a structured onboarding called the **Formation Interview**.

---

## User Flow

1. **Formation Interview** (`index.html`) — 7-phase, 25+ question conversational onboarding capturing the creator's origin story, content types, platforms, income stage, goals (1/5/10/20yr), fears, and preferences
2. **Studio Lot Reveal** — 9 "buildings" unlock based on creator type (Ideation, Studio, CLIPClear, OMNIShield, Distribution, SPOTStream, Brand Builder, Agency Marketplace, Events)
3. **FutureYou Speaks** — Claude API generates a personalized opening statement based on formation answers
4. **Subscribe** (`subscribe.html`) — Tier selection and email capture
5. **Payment** (`payment.html`) — Checkout
6. **Dashboard** (`dashboard.html`) — Persistent studio hub for returning creators

**Public page:** `bill-of-rights.html` — 12 unalterable creator rights (no auth required)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CDN), Babel standalone (JSX in browser) |
| Styling | Inline `<style>` tags, CSS custom properties, no external CSS files |
| Fonts | Bebas Neue (headlines), Outfit (body), Playfair Display (accents) |
| AI | Claude API — model `claude-sonnet-4-20250514` via `api.anthropic.com/v1/messages` |
| Backend | Google Cloud Run — `https://studioyou-api-198959034459.us-east1.run.app` |
| Database | Supabase (inferred — studio name uniqueness, formation storage) |
| Auth | Email-based identification only; no traditional auth; localStorage sessions |
| Build | None — pure static HTML/CSS/JS, no bundler or build step |

---

## Project Structure

```
studioyou-app/
├── index.html           # Formation interview (main React app)
├── subscribe.html       # Subscription / pricing page
├── payment.html         # Payment / checkout
├── dashboard.html       # Creator dashboard (post-formation)
├── bill-of-rights.html  # Public creator rights document
└── assets/              # Logos (PNG), animated GIFs
    ├── SY_LOGO_2D_OFFICIAL.png
    ├── SY_OFFICIAL_*.png
    ├── shutter1.gif
    ├── process-management1.gif
    └── [other brand assets]
```

Each HTML file is fully self-contained (styles + scripts inline). No shared components or modules between pages.

---

## Key Code Locations (index.html)

| What | Where |
|------|-------|
| Phase definitions (7 phases) | `PHASES` array ~line 724 |
| Question definitions (25+) | `QUESTIONS` array ~line 734 |
| Building/feature definitions (9) | `BUILDINGS` array ~line 808 |
| Main React component | `App()` ~line 1187 |
| Claude API call (FY opening) | `startFYSpeech()` ~line 1383 |
| Studio name availability check | `checkAvailability()` ~line 864 |

---

## API Endpoints

**Base:** `https://studioyou-api-198959034459.us-east1.run.app`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/check-studio-name?name=` | GET | Check if studio name is available |
| `/api/formation` | POST | Save completed formation + email |

---

## Data Model (localStorage)

**`sy_formation`** — completed formation object:
```json
{
  "studioName": "",
  "contentTypes": [],
  "platforms": [],
  "experience": "",
  "incomeStage": "",
  "audienceSize": "",
  "origin": "",
  "proudWork": "",
  "failures": "",
  "background": "",
  "admires": "",
  "goal1yr": "", "goal5yr": "", "goal10yr": "", "goal20yr": "",
  "bluesky": "",
  "biggestFear": "",
  "guideStyle": [],
  "voiceStyle": [],
  "fyFrequency": "",
  "alwaysRemember": "",
  "fyFirstWords": "",
  "formedAt": "ISO8601",
  "creatorType": "documentary|social|youtube|podcast|multi-format"
}
```

**Other keys:** `sy_formation_draft`, `sy_email`, `sy_session`, `sy_has_draft`

---

## Design System

**CSS variables (`:root`):**
- `--cyan: #00c8ff`, `--purple: #7b35d4`
- `--grad` (cyan→purple), `--gradT` (cyan→light purple)
- `--black`, `--navy`, `--white`, `--mute`, `--dim`, `--ghost`
- `--gold: #e8c97a` (subscribe + bill-of-rights pages)

**Naming:** CSS classes kebab-case, React state camelCase, no external component library.

---

## Notable Patterns

- **No build process** — React from CDN, JSX compiled client-side with Babel
- **Self-contained pages** — Each HTML file is its own complete app; no shared modules
- **Phase-based UX** — Phases 0 → 2–5 → 6 → 7 (note: phase 1 is skipped)
- **Auto-save drafts** — Formation answers persist to localStorage on every change
- **Fallback speech** — If Claude API fails, `fallbackSpeech()` provides a local default
- **Passable questions** — Questions with `passable: true` can be skipped by the user
- **Mobile breakpoint** — 768px; FY form hidden, grid collapses to single column
