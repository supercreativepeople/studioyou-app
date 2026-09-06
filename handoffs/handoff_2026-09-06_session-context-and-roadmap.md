# Handoff — StudioYou studioyou-app
Date: 2026-09-06
Session: Left rail fixes + strategic architecture discussion (partial loss to compaction — recovered from transcript)

---

## What Was Done (committed and pushed)

| Commit | Fix |
|---|---|
| 17be56b | recommend_section — FY routing now navigates, not just highlights |
| 4435ee4 | Vault stickies for all buildings + auto-switch canvas to VAULT on capture |
| 9dcbf06 | Canvas snaps back to WORK tab on section change |
| 04844ab | Section completion scoped correctly + partial progress (2/5) in sections nav |
| 2015e26 | Progress bar counts unique step completions, not raw vault assets |

All five pushed to GitHub main. Netlify auto-deploy triggered.

---

## Strategic Architecture Discussion (pre-compaction, recovered from transcript)

Lee framed a holistic view before the bug fixes. This context is the real carry-forward.

### Feature Buckets — stated priority order for next sessions

**1. Canvas Details Pane (Console) — highest leverage, do first**
- Currently FY runs silently. User sees output, not process.
- Reference: Luma has the best canvas UI. Higgsfield close second. OpenArt terrible.
- The console should show everything FY is doing throughout the app experience — internal reasoning visible to user, then direct chat. Luma's director canvas and OpenArt's director canvas work this way.
- Once it works, every other system becomes debuggable through it. Platform feels alive vs. web form.
- Canvas details pane is currently stubbed but not functional.

**2. FY Context Awareness — architectural wiring, not a UI job**
- FY currently operates inside a panel in isolation.
- FY needs to know at call time: which building you're in, which section/step is active, what's in the vault for this project, what the journey engine says about where you are.
- That context awareness is what makes FY a guide vs. a chatbot.
- This is a wiring job — connecting FY to building state, section state, vault state, journey engine state.

**3. Buildings / Ideate — third**
- Goal: make section→step→FY call→canvas output→vault write a real, closed loop.
- Once Ideate does this cleanly, stamp the architecture to all buildings with building-specific tools wired in.
- Not cosmetic — it's the data flow that matters.

**4. Journey Engine — last**
- Works mostly, has bugs.
- Needs better integration with the other core modules.
- It's downstream of the canvas/FY/vault data flow. Fix that first, then the engine.

**5. FutureYou (full system) — ongoing**
- Chat feature needs work.
- Custom avatar generation differs between the lot (landing page) and the dashboard (platform action page) — these need to be reconciled.
- FY should be connected to every facet of StudioYou. It's the control center and the real product.

---

## Pre-Code Audit — Identified but NOT Yet Done

Lee and Claude agreed to audit these three things before writing code for the canvas/FY work:

1. How the canvas currently receives and renders FY output
2. What data FY actually has access to at call time (building, section, project, vault)
3. What the canvas details pane currently has stubbed

This audit was deferred when the session pivoted to the immediate left rail bug fixes. **Next session opens with this audit.**

---

## Competitive Reference (Lee's direct assessment, use instead of researching)
- **Luma** — best canvas UI seen. Director canvas shows agent process. Study this.
- **Higgsfield** — close second to Luma.
- **OpenArt** — canvas UI is poor. Don't model.
- **ImagineArt** — similar platform structure, reference for building architecture.

---

## Pending / Not Started

- S2 Orchestration Core spec — top roadmap priority per architecture docs, needs dedicated Fable spec session
- BUILDING_TASKS single-source refactor — currently duplicated in studio.html, feeds canvas/details/vault/FY. Big lift, needs design session.
- Canvas Details pane — stubbed, not functional
- FY context awareness wiring
- Avatar generation reconciliation (lot vs dashboard)
- Journey engine bug audit

---

## Next Session Opens With

Run the pre-code audit of three things:
1. How canvas currently receives and renders FY output
2. What data FY has at call time (building, section, project, vault)
3. What canvas details pane currently has stubbed

Come back with a concrete gap list. Then start with Canvas Details / Console.
