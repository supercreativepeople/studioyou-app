# StudioYou — studioyou-app CLAUDE.md

> This file was 668 lines of session-by-session build history through 2026-08-17, flagged as overdue for a split since 2026-08-07. Split done 2026-08-17 during a pipeline-hardening session. Full history archived verbatim, zero loss, at `handoffs/2026-08-07-through-2026-08-17-pre-protocol-session-history-archive.md`. This file now holds only what's currently true. Cross-repo strategy, business model, and Project HQ live in `studioyou-backend/CLAUDE.md` and Notion — this file stays scoped to this repo's frontend specifics.

**Changelog (most recent 3-5):**
- **2026-08-17:** Split this file per above. Corrected the stale FILE WORKFLOW section below — frontend work goes through git (Desktop Commander, commit, push), not the old chat-upload/Netlify-drag-drop flow; that correction existed in studioyou-backend/CLAUDE.md since 2026-08-16 but had never been propagated here. No frontend code changed this session.

---

## 1. What This Is

`studioyou-app` is the frontend client for StudioYou (studioyou.app): `dashboard.html` (triage, FY avatar entry point), `studio.html` (building workspace, canvas, Vault), `subscribe.html`, `payment.html`, `index.html`. Served by Netlify, auto-deployed on push to `main`. See `studioyou-backend/CLAUDE.md` for the full three-tier FY architecture and current build status (IDEATE ~50%, DEVELOP ~20%, orchestrator unbuilt as of 2026-08-17).

## 2. Repo & Access

Local path: `~/Downloads/studioyou-app`. GitHub: `supercreativepeople/studioyou-app`. Real git repo, confirmed clean and in sync with origin/main as of every session since 2026-08-16.

## 3. File Workflow (corrected 2026-08-17 — supersedes the archived version)

Frontend work goes through the same git workflow as backend and agent: edit via Desktop Commander → `git add` → `git commit` → `git push origin main` → Netlify auto-deploys. The old "Lee provides in chat → Claude modifies → present_files → Lee downloads → Netlify drag-and-drop" flow is retired (Lee confirmed 2026-08-16, see `studioyou-backend/CLAUDE.md` Locked Decisions) — it predated git tracking on this repo and left files living only on Lee's local Mac with no session record. Never revert to it.

## 4. FY Client Architecture (current)

**Avatar modes:** chat-only (LiveKit + Deepgram) or full avatar (+ Cartesia + Runway Characters). Runway sessions hard-cap at 5 minutes platform-side — `agent.py` (studioyou-fy-agent repo) handles rotation, not this repo.

**Dashboard → Studio handoff:** warm-room handoff — the LiveKit room, agent, and Runway worker survive navigation; studio.html reuses the dashboard's token and attaches its own audio tracks. Write conversation history to `localStorage.sy_fy_conversation`; studio.html's `connectLiveKit` sends the last 10 messages to `/api/avatar/livekit-session` on load.

**Vault:** `studio.html` persists creator answers to Supabase via `/api/vault/capture` and `/api/vault/list` (backend routes). Sticky-note visual gated to IDEATE; other buildings use a grouped asset list. Canvas renders one sticky per step live via the same subscribe mechanism.

**Building structure source of truth:** currently split between `studioyou-backend/knowledge/buildings/*.md` (agent-side) and `BUILDING_TASKS` in `studio.html` (frontend-side) — a known drift risk (caused one real naming-mismatch bug, since fixed). The FY Structural Adherence locked decision (see archive, July 7 2026) calls for collapsing this to one canonical schema as part of the orchestrator build — not yet done.

## 5. Critical Technical Rules

Code editing: `grep -n` for exact line numbers; Python replace for multi-line blocks; never `sed` for JS function bodies.

JSX: `forwardRef` closes with `});`. JSX comments in closing tags break Babel. Use double-quoted strings for any text containing apostrophes.

React flex layouts: add `min-height:0` to flex children that need to scroll.

`backdrop-filter` stacking context: modals inside a `backdrop-filter` parent must use `ReactDOM.createPortal` to `document.body`.

Babel CDN: pin to `@babel/standalone@7.23.10`, never unpinned. `livekit-client`: load dynamically inside component code, never as a static `<script>` tag; pin to `livekit-client@2.9.9`.

Git divergent branches: `git pull origin main --rebase`, then push.

Desktop Commander occasionally times out (observed 4-minute timeout where the call had actually succeeded server-side). On a timeout, verify actual file state via read/grep before assuming failure and retrying.

## 6. Locked Decisions Still Governing

**Warm-room handoff** is the dashboard→studio architecture — do not revisit without a new session decision (see archive, Session AB, for why fresh-session-on-studio-load was rejected).

**Structural adherence:** FY must never improvise outside the active building/section/step. Advancement fires only on deterministic SUCCESS STATE evaluation (Section 6.1 of `FY_LAYER2_SCHEMA.md`, `studioyou-backend/knowledge/`), never the model's own judgment. This is the orchestrator's core scope, not a parallel workstream.

**Creator-facing litmus test:** every step must be clear enough that a creator never has to guess the "right" answer — outweighs pure Tier-2 checkability when the two conflict.

Full reasoning for both preserved in the archive file (Sessions AA, and the July 7 2026 FY Structural Adherence entry).

## 7. Infrastructure Reference

Domain: studioyou.app (Porkbun). DNS/CDN: Cloudflare. Host: Netlify. Backend: Cloud Run (`studioyou-api`, us-east1, `neat-tangent-474222-m9`), `https://studioyou-api-198959034459.us-east1.run.app`. DB: Supabase (`rubwhfjwqonqhfbkhren`). Agent: LiveKit Cloud (`studioyou-futureyou-avatar-749nqz32.livekit.cloud`) — current agent ID lives in `studioyou-fy-agent/CLAUDE.md`, changes on every recreate, don't trust a cached value here.

## 8. Notion Reference

Full cross-repo pointer list lives in `studioyou-backend/CLAUDE.md`. Repo-specific: session history predating `handoffs/` (Sessions M–AF) is archived at `handoffs/2026-08-07-through-2026-08-17-pre-protocol-session-history-archive.md`, not in Notion.
