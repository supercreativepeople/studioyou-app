# Session: platform / partner / subscription tracker build-out — 2026-08-09

Cross-repo session. Full record in `studioyou-backend/handoffs/2026-08-09-platform-tracker-buildout.md`. This file covers what changed here.

## Changes

`SERVICES.md` gained `Billing Entity`, `Account Standing`, `Cost / Balance`, and `Blocks Alpha` columns, matching the other three repos and the Notion registry. Before this there was nowhere to record that an account was unpaid or exhausted.

Rows added or corrected:

- **Fal.ai** added. This repo already surfaces it: `studio.html:1531` labels the Capture & Execution step "fal.ai / seedance", and `admin.html:712` reports `fal-ai/seedance-v1` in the health panel. It was absent from every SERVICES.md until today.
- **Domain studioyou.app** added. No domain rows existed for StudioYou anywhere.
- **LiveKit** and **Runway** marked as alpha blockers: $50 balance due and credits exhausted respectively. The dashboard avatar flow depends on both.
- **Tavus Phoenix** marked Deprecated.
- Billing set to `Lee (personal)` throughout, per Lee: every paid resource is personally funded on personal cards.

Corporate structure recorded: **Frisson Digital, Inc. is the parent company owning both StudioYou and SCREENBot**, superseding the per-product newco plan. StudioYou and SCREENBot remain independent products under a common parent.

## Still open here

- [ ] **`dashboard.html:2234` still shows users "Tavus Phoenix is aging your photo. ~2-5 min."** The live pipeline is Runway. Flagged 2026-08-08, still unfixed, wording is Lee's call.
- [ ] Checkpoint commit `54c6458` (92 files) still has had no file-by-file review. Flagged 2026-08-07.
- [ ] Confirm registrar and renewal date for studioyou.app.
- [ ] **This repo lives in `~/Downloads`.** The dev-session-protocol classifies Downloads as an untrusted staging tier, not a working copy. Proposed: move to `~/Projects` alongside the other two. This inconsistency is plausibly how the 92-file uncommitted checkpoint went unnoticed for so long.
