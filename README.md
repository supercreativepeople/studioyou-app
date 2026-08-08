# StudioYou — Gamification Features
## FutureYou Avatar + Studio World Hero
### Design & Implementation Brief

**Session date:** May 15, 2026  
**Build context:** StudioYou v2.3.0 dashboard  
**Features designed:** 2  
**Files delivered:** `FutureYou Avatar.html`, `Studio World Hero.html`

---

## Overview

Two gamification components built to deepen the StudioYou creator identity experience:

1. **FutureYou Avatar** — A live, age-progressed AI avatar of the user, sourced from their photo and delivered as a real-time video conversation via Tavus Phoenix + LiveKit. Replaces / augments the FY text rail with a live video presence.

2. **Studio World Hero** — A cinematic, living display of the user's movie studio lot in the upper third of the dashboard. The studio's iconic water tower displays the user's chosen studio name. Driven by their briefing archetype via Reactor's Helios API. Auto-generates on every dashboard load. Personal, deterministic, and seeded to their identity.

---

## Feature 1 — FutureYou Avatar

### Concept
The user uploads a recent headshot. Tavus Phoenix age-progresses it 20–30 years and builds a photorealistic digital replica. A LiveKit conversation room is started with the replica — FutureYou stops being text and becomes a face. The FY rail on the dashboard transforms into a live video session.

### User Flow
```
Formation: studio_name phase
    ↓
[NEW] photo phase
    ├── "FUTUREYOU IS WAITING." screen
    ├── Drag-and-drop or file-upload headshot
    ├── CTA: BUILD FUTUREYOU →
    └── Skip: "I'll do this later"
    ↓
Tavus pipeline (auto-advancing, ~8s total)
    ├── Step 1 — Photo uploaded → Tavus Phoenix
    ├── Step 2 — Biometric analysis (128 reference points)
    ├── Step 3 — Age progression +25 years (diffusion pass 1/3)
    ├── Step 4 — Replica build (voice + motion model)
    └── Step 5 — LiveKit room join (conversation_url ready)
    ↓
Dashboard loads with FY Rail in AVATAR MODE
    ├── Video zone: live Tavus avatar (LiveKit stream)
    ├── Audio / Video / Text controls
    ├── Conversation thread (FY voice still speaks)
    └── Text input still available below
```

### API Integration

#### Tavus Phoenix
```
POST https://tavusapi.com/v2/replicas
{
  "train_video_url": "<user photo URL or base64>",
  "replica_name": "FutureYou — [studio_name]"
}
→ Returns: { "replica_id": "r_xxxx" }

POST https://tavusapi.com/v2/conversations
{
  "replica_id": "r_xxxx",
  "conversation_name": "FutureYou — [studio_name]",
  "conversational_context": "<FY system prompt built from formation data>",
  "custom_greeting": "I know what it took to get here. Let's build."
}
→ Returns: { "conversation_id": "c_xxxx", "conversation_url": "https://tavus.daily.co/..." }
```

#### LiveKit
The `conversation_url` returned by Tavus IS a LiveKit-backed room. Two integration options:

**Option A — Simplest (iframe embed):**
```html
<iframe
  src="{conversation_url}"
  allow="camera; microphone; fullscreen"
  style="width:100%; height:100%; border:none;"
/>
```

**Option B — Custom UI (LiveKit SDK):**
```bash
npm install @livekit/components-react livekit-client
```
Use `<LiveKitRoom>` + `<VideoTrack>` to build the custom video zone shown in the design. Gives full control over the controls bar, audio indicators, and conversation thread overlay.

#### Backend endpoints to add (main.py)
```python
@app.route('/api/tavus/replica', methods=['POST'])
def create_tavus_replica():
    # Receives: { email, photo_url OR photo_base64 }
    # Calls Tavus POST /v2/replicas
    # Stores replica_id in formations.data jsonb
    # Returns: { replica_id }

@app.route('/api/tavus/conversation', methods=['POST'])
def start_tavus_conversation():
    # Receives: { email }
    # Reads replica_id from Supabase
    # Builds FY conversational_context from formation data
    # Calls Tavus POST /v2/conversations
    # Returns: { conversation_url, conversation_id }
```

Add `TAVUS_API_KEY` to Cloud Run env vars and `_TAVUS_API_KEY` to Cloud Build substitution vars.

### FY Conversational Context (Tavus system prompt)
Build this from formation data — same pattern as the existing FY system prompt:
```
You are FutureYou — [firstName]'s future self, back to guide the build.
You appear as a live video avatar, aged 25 years ahead.
Studio: [studio_name] | Archetype: [archetype] | Phase: [phase]
Arsenal: [arsenal] | Roadblock: [roadblock] | Horizon: [horizon]

Formation Q&A:
[12 answers mapped Q1-Q12]

Rules: Direct. Sovereign. No filler. Reference specific answers.
One recommendation at a time. Peer register. Under 60 words per response.
No exclamation marks. No hedging. You already know them — act like it.
```

### Formation Flow Change (index.html)

Add `photo` as a phase between `studio_name` and dashboard redirect:

```javascript
// Phase map addition
const PHASES = {
  home: 0, briefing: 10, preamble: 20, fy: 45,
  summary_email: 72, studio_name: 90,
  photo: 95  // ← NEW
};

// After studio_name confirmation, navigate to photo phase
// Photo phase → on upload: POST /api/tavus/replica → store replica_id
// → auto-advance to generating state (~8s) → redirect to dashboard.html
// → on skip: redirect directly to dashboard.html
```

**localStorage keys to add:**
| Key | Value | Set by |
|---|---|---|
| `sy_replica_id` | Tavus replica ID | photo phase |
| `sy_avatar_ready` | `'true'` | After conversation_url confirmed |
| `sy_conversation_url` | LiveKit room URL | start conversation endpoint |

### Dashboard Integration (dashboard.html)

In the FY rail, gate on `sy_avatar_ready`:

```jsx
function FYRail() {
  const avatarReady = localStorage.getItem('sy_avatar_ready') === 'true';
  const [mode, setMode] = useState(avatarReady ? 'avatar' : 'text');

  return (
    <div className="fy-rail">
      <div className="fy-rail-header">
        <span className="fy-rail-dot" />
        <span className="fy-rail-label">
          {mode === 'avatar' ? 'FUTUREYOU — AVATAR LIVE' : 'FUTUREYOU'}
        </span>
        {avatarReady && (
          <button onClick={() => setMode(m => m === 'avatar' ? 'text' : 'avatar')}>
            {mode === 'avatar' ? 'TEXT' : 'AVATAR'}
          </button>
        )}
      </div>

      {mode === 'avatar' && <AvatarVideoZone />}
      {mode === 'text'   && <FYTextPanel />}
    </div>
  );
}
```

---

## Feature 2 — Studio World Hero

### Concept
On every dashboard load, the user's briefing data feeds an **Archetype Engine** that concludes which of the 5 creator categories they are. That archetype drives a Helios prompt constructed around their specific studio name. Reactor streams a living, cinematic movie studio world with their water tower as the anchor landmark — their studio name painted on it in classic block letters. The stream occupies the upper third of the dashboard main screen, between the topbar and the building lot.

### Architecture

```
Dashboard loads
    ↓
Read: sy_briefing, sy_formation, sy_archetype, sy_studio_name, sy_email
    ↓
Archetype Engine
    ├── If sy_archetype set → use it
    └── Else → score 5 archetypes from briefing keywords → conclude top scorer
    ↓
Build Helios prompt from archetype + studio_name
    ↓
Generate world seed from email hash (deterministic — same world every session)
    ↓
POST /api/reactor/token → get JWT
    ↓
Initialize Reactor SDK → set_image(SY_WATER_TOWER_MCU.jpg)
    ↓
set_seed(emailHash) → consistent personal world
    ↓
schedule_prompt(chunks 0, 5, 10) → 3-act cinematic sequence
    ↓
Stream plays in the hero panel (upper third of dashboard)
    ↓
pause() on tab blur, resume() on tab focus
```

### Dashboard Layout Change

The `StudioWorldHero` component sits **between** the topbar and the `.main-body` div — not inside the scrollable canvas. This keeps it always visible:

```
.main
  ├── .topbar (54px, existing)
  ├── .swh (284px) ← NEW — Studio World Hero
  └── .main-body (remaining height ~560px at 900px viewport)
        ├── .sidebar
        ├── .main-canvas (buildings grid, scrollable)
        └── .fy-rail
```

In `dashboard.html`, add inside the `.main` div after the topbar:
```jsx
<StudioWorldHero
  studioName={studioName}
  archetype={concludeArchetype(briefing(), formation())}
  phase={localStorage.getItem('sy_phase') || '1'}
  seed={generateSeed(localStorage.getItem('sy_email') || studioName)}
/>
```

### Prebuilt Archetype List

| ID | Label | Accent Color | Trigger Keywords |
|---|---|---|---|
| `documentary` | DOCUMENTARY | `#e8c97a` (gold) | documentary, long-form, investigative, film, broadcast, journalism |
| `social-creator` | SOCIAL CREATOR | `#00c8ff` (cyan) | social, tiktok, instagram, reels, short-form, viral, audience |
| `youtube-creator` | YOUTUBE CREATOR | `#ff6b6b` (red) | youtube, channel, subscriber, series, niche, thumbnails |
| `podcast-host` | PODCAST HOST | `#4cff91` (green) | podcast, audio, interview, conversation, voice, microphone |
| `multi-format` | MULTI-FORMAT | `#a06be8` (violet) | production company, multi-format, everything, scale, empire |

**Scoring function:** Count keyword matches against concatenated arsenal + roadblock + horizon + 12Q answers. Highest match wins. If no matches, defaults to `documentary`.

**Recommendation:** For production, pass the full formation Q&A through Claude (single API call, ~50 tokens) for a more nuanced archetype conclusion, then cache the result in `sy_archetype` and `formations.archetype` column.

### Archetype → Helios Prompt Templates

```javascript
const HELIOS_PROMPTS = {
  'documentary': `Cinematic documentary production studio at golden hour.
    Archive film reels, professional cameras on tripods, editing suites
    with timeline displays visible through glass walls. Warm amber light,
    long shadows across the lot. The water tower displays "[STUDIO_NAME]"
    in classic painted block letters — weathered, permanent.
    Drone establishing shot, slight upward tilt. Photorealistic 4K.`,

  'social-creator': `Modern creator campus at blue hour. Ring lights glowing,
    multiple camera setups, studio walls showing live audience dashboards.
    The water tower displays "[STUDIO_NAME]". Kinetic, forward-leaning.
    Drone shot. Photorealistic 4K.`,

  'youtube-creator': `Premium YouTube production studio, late afternoon.
    Cinema camera on rails, curated background wall, professional color
    monitors. The water tower displays "[STUDIO_NAME]". Polished, aspirational.
    Drone establishing shot. Photorealistic 4K.`,

  'podcast-host': `Intimate podcast studio campus at evening warmth.
    Acoustic panels, professional condenser microphones, soft lighting.
    The water tower displays "[STUDIO_NAME]". Quiet authority.
    Drone establishing shot. Photorealistic 4K.`,

  'multi-format': `Sprawling multi-purpose production complex from above.
    Sound stages, outdoor areas, editing tower glowing.
    The water tower displays "[STUDIO_NAME]". Empire under construction.
    Drone establishing shot. Photorealistic 4K.`,
};
```

### Reactor / Helios Integration

#### Backend (main.py) — one new endpoint
```python
@app.route('/api/reactor/token', methods=['POST'])
def get_reactor_token():
    """
    Exchange REACTOR_API_KEY for a short-lived JWT.
    Frontend uses this token to initialize the Reactor SDK.
    ~15 lines. Mirrors the existing /api/auth pattern.
    """
    import jwt, time
    payload = {
        'key': os.environ.get('REACTOR_API_KEY'),
        'iat': int(time.time()),
        'exp': int(time.time()) + 3600,  # 1 hour
    }
    token = jwt.encode(payload, os.environ.get('REACTOR_API_KEY'), algorithm='HS256')
    return jsonify({'token': token})
```

`REACTOR_API_KEY` is already set as a Cloud Run env var and Cloud Build substitution var. No new infrastructure required.

#### Frontend Reactor SDK flow
```javascript
// 1. Get token from backend
const { token } = await fetch('/api/reactor/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: localStorage.getItem('sy_email') })
}).then(r => r.json());

// 2. Load Reactor SDK
const script = document.createElement('script');
script.src = 'https://reactor.unstable.run/sdk/v0.0.111/reactor.umd.js';
document.head.appendChild(script);
await new Promise(resolve => script.onload = resolve);

// 3. Initialize with seed (deterministic personal world)
const reactor = new window.Reactor({ apiKey: token });
await reactor.connect(token);

// 4. Set base image (water tower MCU shot as seed)
await reactor.set_image('https://studioyou.app/assets/SY_WATER_TOWER_MCU.jpg');

// 5. Set deterministic seed (same world every session)
await reactor.set_seed(generateSeed(localStorage.getItem('sy_email')));

// 6. Schedule 3-act cinematic sequence
await reactor.schedule_prompt(0,  buildHeliosPrompt(archetype, studioName));  // Reveal
await reactor.schedule_prompt(5,  `Close on the water tower — "${studioName}" in focus.`);
await reactor.schedule_prompt(10, `Sweeping lot overview, all stages visible. ${studioName} empire.`);

// 7. Render in hero panel
reactor.attachTo(document.querySelector('.swh-helios-video'));

// 8. Pause/resume on tab visibility
document.addEventListener('visibilitychange', () => {
  document.hidden ? reactor.pause() : reactor.resume();
});
```

#### Helios Key Capabilities (from helios.rtf)
- **14B-parameter Diffusion Transformer** — produces an infinite, steerable video stream
- **33 frames per chunk** (~1.4s at 24fps) — UI reactions appear within 1–2 seconds
- **`set_image`** — upload any image, it animates it into a living scene
- **`schedule_prompt`** at specific chunks — script cinematic sequences in advance
- **`set_seed`** — same seed = same video, always. Reproducible per-user worlds
- **`prompt_switched` event** — exact notification when video transitions, sync UI frame-perfectly
- **`pause` / `resume`** — stop on tab blur, resume without losing state
- **`blend` transition** — smooth cinematic progression for stage upgrades
- **`cut` transition** — dramatic reveal for major tier changes

### Water Tower Name Rendering

The `SY_WATER_TOWER_MCU.jpg` asset shows the cylindrical tank in MCU (medium close-up). "STUDIOYOU" is painted in large dark block letters across the middle band of the tank.

**CSS compositing approach (current prototype):**
- The MCU image is displayed with `object-fit: cover; object-position: center 38%`
- A cream band (`rgba(230,214,192,0.9)`) is absolutely positioned over the text zone (top: 23%, height: 40%) — this covers the existing "STUDIOYOU" text
- The user's studio name renders inside the band in `#140801` (dark warm brown, Bebas Neue)
- Font size scales with name length: ≤4 chars → 46px, ≤7 → 38px, ≤10 → 30px, ≤14 → 24px, longer → 20px
- Multi-word names split across two lines

**Production approach (Helios):**
- Feed `SY_WATER_TOWER_MCU.jpg` via `set_image` — Helios animates the tower into a living scene
- The Helios prompt explicitly names the studio: `"...the water tower displays '[STUDIO_NAME]' in classic painted block letters"`
- Helios generates a new image with the user's name genuinely composited onto the tower surface
- Result streams into the hero panel as a live, animated scene

**The `set_seed` tied to their email hash means their water tower world is consistent and personal — every time they return, it's the same world, evolving only when they hit new stages.**

### World Seed Generation
```javascript
function generateSeed(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0) % 99999;
}
// Same email → same seed → same studio world, every session
```

### Stage Completion Cinematics (future build)
When a creator marks a FutureYou stage complete:
```javascript
// Trigger stage upgrade cinematic
await reactor.schedule_prompt(currentChunk + 1,
  `${studioName} studio lot — stage complete. New wing opening. Blend transition.`,
  { transition: 'blend' }  // smooth for upgrades
);

// Sync UI milestone animation to exact frame
reactor.on('prompt_switched', (chunk) => {
  if (chunk === targetChunk) {
    triggerMilestoneAnimation();  // badge unlock, counter tick
  }
});
```

---

## Build Order

| Step | What | Where | Complexity |
|---|---|---|---|
| 1 | `POST /api/reactor/token` | main.py | Trivial (~15 lines) |
| 2 | Add `StudioWorldHero` to dashboard | dashboard.html | Low |
| 3 | `POST /api/tavus/replica` | main.py | Low |
| 4 | `POST /api/tavus/conversation` | main.py | Low |
| 5 | Add `photo` phase to index.html | index.html | Low |
| 6 | Wire avatar mode to FY rail | dashboard.html | Medium |
| 7 | Stage completion cinematics + `prompt_switched` sync | dashboard.html | Medium |

---

## New Environment Variables Required

| Var | Service | Where |
|---|---|---|
| `REACTOR_API_KEY` | Cloud Run | Already set ✓ |
| `TAVUS_API_KEY` | Cloud Run | Add new |
| `_TAVUS_API_KEY` | Cloud Build substitution | Add new |

---

## New localStorage Keys

| Key | Value | Set by |
|---|---|---|
| `sy_replica_id` | Tavus replica ID string | `photo` phase |
| `sy_avatar_ready` | `'true'` | After conversation URL confirmed |
| `sy_conversation_url` | LiveKit room URL | `/api/tavus/conversation` |

These slot into the existing frozen localStorage schema without conflicts.

---

## File Inventory

```
studioyou-app/
├── dashboard.html           ← v2.3.0 — add StudioWorldHero + avatar rail
├── index.html               ← v2.3.0 — add photo phase after studio_name
├── FutureYou Avatar.html    ← NEW — Tavus + LiveKit feature prototype
├── Studio World Hero.html   ← NEW — Helios dashboard hero prototype
├── archetypes.html          ← existing Reactor/Helios test harness
├── helios.rtf               ← Helios capability reference document
├── assets/
│   ├── SY_WATER_TOWER_MCU.jpg   ← hero base image for set_image
│   ├── SY_LOT1_MWS_V1.jpg       ← studio lot background
│   ├── SY_LOT2_WS_V1.jpg        ← alternate lot angle
│   └── ...
└── README.md                ← this file
```

---

## Design Notes

- The water tower MCU image (`SY_WATER_TOWER_MCU.jpg`) is the ideal `set_image` seed for Helios — it's a strong, high-contrast reference with the tank clearly centered
- The lot image (`SY_LOT1_MWS_V1.jpg`) works as the hero panel background establishing shot — shows the full studio world with the tower naturally visible in the upper right
- Both assets are already at `https://studioyou.app/assets/` — use absolute URLs for Tavus/Helios API calls
- The `SY_SHUTTER_FAVICON.gif` remains the favicon; no changes needed there
- The Helios `pause/resume` pattern is critical for cost control — always pause on `document.hidden`

---

## Working Principles (existing, unchanged)

- Backend edits: clone → edit `main.py` → push → Cloud Build auto-deploys
- Frontend: edit in container → present files → Lee downloads → drags to Netlify
- Verify backend: `curl /api/health` after push
- `studioyou-api` is the active Cloud Run service — not `studioyou-backend`
- No double dashes in copy — AI tell
- No skip/pass in UX — except studio name and photo (both intentional)

---

*Built with Claude. Session: May 15, 2026.*
