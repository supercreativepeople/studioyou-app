# SERVICES.md - StudioYou App (client)

Every external platform/service this project depends on. Update at session close whenever something changes. Credentials are NEVER stored here, pointer only. Mirrored into the cross-project Notion Platform & Service Registry (`https://app.notion.com/p/dd60c5c5ccda496eb10d58f8db0bc8b6`) at session close per the `dev-session-protocol` skill.

| Service | Category | Purpose | Account / Org ID | Console URL | Subscription / Tier | Renewal | Credential Location | Status | Last Verified |
|---|---|---|---|---|---|---|---|---|---|
| GitHub - studioyou-app | Other | Source code, CLAUDE.md, handoffs/ — GitHub status was previously "unconfirmed" in the dev-session-protocol repo table; confirmed live and reachable 2026-08-07 | github.com/supercreativepeople | https://github.com/supercreativepeople/studioyou-app | free | n/a | git credential helper (osxkeychain, remote URL de-tokenized 2026-08-07) | Active | 2026-08-07 |
| Netlify | Distribution/Deploy | Frontend host — studioyou.app | app.netlify.com | app.netlify.com | unconfirmed tier | n/a | Netlify login (`.netlify/` local config present) | Active | not independently re-verified 2026-08-07 |
| Cloud Run - studioyou-api (shared) | Hosting | Backend the client calls (see studioyou-backend/SERVICES.md) | neat-tangent-474222-m9 | console.cloud.google.com/run | pay-as-you-go | n/a | n/a (backend-side) | Active | not independently re-verified 2026-08-07 |
| Tavus Phoenix | AI/API | Referenced in a design brief (FutureYou Avatar feature) for age-progressed avatar generation — status of this specific client integration not independently verified | tavusapi.com | tavusapi.com | unconfirmed | n/a | unconfirmed | Needs Verification | 2026-08-07 |
| LiveKit (shared) | Realtime | Live avatar conversation rooms, consumed by dashboard/studio pages | studioyou-futureyou-avatar-749nqz32.livekit.cloud | cloud.livekit.io | unconfirmed | n/a | client-side token from backend | Active | not independently re-verified 2026-08-07 |

Note (2026-08-07 session): this repo's working tree had ~92 files of accumulated uncommitted work (new assets, edited pages, some deletions) sitting unsaved since an unknown prior date. Committed as a checkpoint this session (see handoffs/). Push is pending — see session handoff for the exact command to finish syncing to GitHub.
