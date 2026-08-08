# claude.md Amendment — Process Rules, Status System, FY Structural Adherence (drafted July 7, 2026 planning session, Fable 5)

**Merge instructions for Session AG (first push of the session, before any dev work):**
1. In `## Session Start Protocol`, add items 4 and 5 below.
2. In `## Session End Protocol`, add item 6 below.
3. In `## Sprint System` → Process rules, add rules 3 and 4 below.
4. Insert the `## LOCKED DECISION — FY Structural Adherence` section with the other locked decisions.
5. Replace the Next Session priority list with the `Revised Session AG queue` below.
6. Update the header: Last Updated → Session AG date.
Nothing else in claude.md changes.

---

**ADD to Session Start Protocol (items 4 and 5):**

4. **Model confirmation** — before any work, confirm the running model matches this session's tracker allocation (Fable 5 = spec/architecture only; Sonnet 5 = implementation/integration/live-test/SCREENBot; Opus 4.8 = S6 hardening). State the running model and the session type in the first response. If they don't match, stop and flag to Lee before commencing build. Context: Lee was defaulted to a wrong model by a marketing bubble in Session AF; the model must never be assumed.

5. **Sprint status header** — open every session with an on/off-track report computed from the live tracker, not memory:
   - Current sprint, days remaining in its window
   - Done / In Progress / In Sprint / Backlog / Blocked counts for the current sprint
   - Verdict: **ON TRACK** / **AT RISK** / **OFF TRACK**, with the one-line reason
   - What must land this week for the sprint to close on time

**ADD to Session End Protocol (item 6):**

6. **Closing status footer** — repeat the sprint status header showing the delta from session open (what moved, what didn't, revised verdict). This is Lee's primary on/off-track signal; it is not optional and not summarized away.

---

**ADD to Sprint System → Process rules (items 3 and 4):**

3. **Search before ask** — exhaust claude.md, the handoff docs, the Sprint Tracker, agent/Cloud Run logs, and source files before putting any question to Lee. Lee is the final confirmation, never the first resort. Asking Lee something the record already answers is a protocol violation. (Adopted July 7 after a stale-memory question about the Runway 5-minute cap that claude.md itself answered — rotation was built Session AD.)

4. **Protocol deviation = full stop** — any deviation from claude.md or the handoff doc (file workflow especially: container → `present_files` → Lee downloads → Netlify for frontend; git pull → edit → commit/push for backend and agent) stops work immediately and gets flagged to Lee before continuing. Not logged after the fact, not batched to session close. Session AF's two Desktop Commander direct-edits of `Downloads/studioyou-app` are the reference case — self-caught, but after the fact, and likely cost a redeploy a fix.

---

## LOCKED DECISION — FY Structural Adherence (July 7, 2026, Lee)

**The building structure IS the app.** Buildings → sections → steps is how the app flow works and is the basis of every tool call. FY must never improvise conversation outside the active step — improvised output is unusable, burns avatar credits/tokens, and frustrates the creator. Sections and steps WILL be added, modified, and replaced as the methodology evolves; that evolution is impossible if FY is not deterministically bound to the structure. This problem is fully solved before anything is built on top of it.

**Current-state assessment (honest):** Session AE's step-schema injection is prompt-level guidance, not enforcement — the model can still drift, and only IDEATE and DEVELOP are wired; other buildings run on section titles alone. Two structural defects underneath:
1. **Dual source of truth** — building structure lives in both `knowledge/buildings/*.md` (agent) and `BUILDING_TASKS` in studio.html (frontend). The Step 7 naming mismatch was this drift.
2. **Model self-tracks position** — no backend state holds "this project is in IDEATE, Section 2, Step 4." Adherence is a behavioral hope.

**The architecture (extends the Session AA Section 6.1 locked decision — deterministic checks, never model self-judgment):**
1. One canonical machine-readable schema per building (JSON in `knowledge/`, git-reviewed during alpha), served by a backend endpoint that BOTH studio.html and the agent consume. Supabase migration only if runtime schema editing is ever needed.
2. Backend step-state machine — current building/section/step persisted per project, server-side.
3. FY's context scoped to the active step only.
4. Advancement fires exclusively on deterministic SUCCESS STATE evaluation.
5. Off-step creator input handled by a defined rule (map back to the current step, or capture-and-defer) — never open improvisation.

**Ownership:** this IS the Tier 2 orchestrator's core, not a parallel workstream. The S2 orchestrator spec (Fable 5) explicitly owns items 2–5; the schema single-source refactor (new S2 tracker row, P0) is the first implementation item because the state machine reads from it. S2 starts on schedule — the Anthology gate depends on it.

---

## Revised Session AG queue (replaces the AF 10-item list — the tracker is the queue, this is the pointer)

Session AG runs on **Sonnet 5**. S1 closes when the two retest rows go Done.

1. **Retest checklist** (full checklist lives in the "Retest building-map context fix live" tracker row): full IDEATE walk confirming no re-asked steps + Step 7 clean; avatar toggle re-verified via `lk agent logs` (AF fix confirmed once, Lee has low confidence due to Cowork protocol issues that session — verify, don't trust the record); conversation past 5 minutes confirming the Session AD 270s rotation fires without a drop; log every FY deviation from the step schema as baseline data for the S2 orchestrator spec.
2. **`generate_visual` end-to-end via live voice** — confirm the image lands on canvas, not just the tool-call log.
3. If room remains: project creation flow (filler — orthogonal to the conversation loop, does not gate anything).

**Moved to S5 (July 7 planning, Lee approved):** Canvas Details learning-terminal reframe, canvas live-build state, Vault file-browser rework, sticky select-to-reveal action set. All UX polish; nothing in S2–S4 depends on them; the terminal narration and live-build state are worth far more once Tier 3 sub-agents actually dispatch (S4).

**New S2 rows (July 7 planning):** Building schema single-source refactor (P0, first implementation item), Generated-asset persistence → Supabase (P1, promoted from open-items — Tier 3's primary output cannot be session-only by S4).

After AG confirms the fixes hold: S2 opens on schedule — Tier 2 orchestrator spec (Fable 5, first block after the weekly usage reset, re-scoped to own structural adherence) → schema refactor → orchestrator implementation. Anthology submission remains gated on S2 exit with a live Fable-orchestrated demo.

---

## Week of Jul 7 schedule (locked July 7 evening, Lee approved)

Weekly usage cycle confirmed from the account: **resets Friday 11:00 AM.** At lock time: all-models pool 72% used, Fable 49% used.

- **Session AG (Sonnet 5): Wednesday or Thursday.** Retest session, fits the remaining ~28% pool. Must complete before Friday's spec session — the spec consumes AG's schema-deviation observations.
- **S2 orchestrator spec (Fable 5): Friday, first block after 11:00 AM reset.** Fresh Fable pool; pulls the spec three days ahead of S2's Monday open — buffer on the Anthology gate.
- **Schema single-source refactor (Sonnet 5): weekend or Monday**, full weekly pool behind it.
- **SCREENBot: zero sessions this week** — Lee's call, deferred to next week. Entire remaining pool goes to StudioYou.
- Contingency: if AG slips past Thursday, the Friday spec session still runs — note the missing deviation baseline in the spec rather than delaying it.
