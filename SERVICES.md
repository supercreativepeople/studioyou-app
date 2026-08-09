# SERVICES.md - StudioYou App (client)

Every external platform/service this project depends on. Update at session close whenever something changes. Credentials are NEVER stored here, pointer only. Mirrored into the cross-project Notion Platform & Service Registry (`https://app.notion.com/p/dd60c5c5ccda496eb10d58f8db0bc8b6`) at session close per the `dev-session-protocol` skill.

## Corporate / billing structure (recorded 2026-08-09)

**Frisson Digital, Inc. is the parent company and owns both StudioYou and SCREENBot.** This supersedes the earlier per-product newco plan (StudioYou Inc., Delaware C-corp, with SCP Inc. as venture studio) still described in `studioyou-backend/CLAUDE.md`. A single parent owning both products aligns with incubator programs, Anthropic's programs, and fundraising opportunities.

**Every billing instance is to be established through Frisson Digital, Inc.** The `Billing Entity` column records what each account bills to *today*. Accounts predating the Frisson structure may still sit on a personal card, so they read `Unconfirmed` rather than being assumed.

## Schema note (2026-08-09)

Four columns added: `Billing Entity`, `Account Standing`, `Cost / Balance`, `Blocks Alpha`. Before this the format had nowhere to record an unpaid or exhausted account.

## Services

| Service | Category | Purpose | Billing Entity | Account Standing | Cost / Balance | Blocks Alpha | Account / Org ID | Console URL | Subscription / Tier | Renewal | Credential Location | Status | Last Verified |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GitHub - studioyou-app | Other | Source code, CLAUDE.md, handoffs/ | Free / no billing | Free tier | $0 | no | github.com/supercreativepeople | https://github.com/supercreativepeople/studioyou-app | free | n/a | git credential helper (osxkeychain, de-tokenized 2026-08-07) | Active | 2026-08-07 |
| Netlify | Distribution/Deploy | Frontend host, studioyou.app | Unconfirmed | Unconfirmed | unconfirmed | no | app.netlify.com | app.netlify.com | unconfirmed tier | n/a | Netlify login (`.netlify/` local config present) | Active | not independently re-verified |
| Domain - studioyou.app | Domain/DNS | Primary product domain | Unconfirmed | Unconfirmed | unconfirmed | no | - | - | unconfirmed | **unknown** | registrar login | Needs Verification | 2026-08-09 (added) |
| Cloud Run - studioyou-api (shared) | Hosting | Backend the client calls, see studioyou-backend/SERVICES.md | Unconfirmed | Unconfirmed | usage-based | no | neat-tangent-474222-m9 | console.cloud.google.com/run | pay-as-you-go | n/a | n/a (backend-side) | Active | not independently re-verified |
| LiveKit (shared) | Realtime | Live avatar conversation rooms, consumed by dashboard/studio pages | Unconfirmed | **Balance due** | **$50 outstanding, unpaid** | **YES** | studioyou-futureyou-avatar-749nqz32.livekit.cloud | cloud.livekit.io | unconfirmed | n/a | client-side token minted by backend | Active | 2026-08-09 |
| Runway (shared) | AI/API | Avatar rendering behind the dashboard avatar flow | Unconfirmed | **Credits exhausted** | **needs top-up, amount TBD** | **YES** | - | runwayml.com | unconfirmed | n/a | agent-side (studioyou-fy-agent/.env) | Active | 2026-08-09 |
| Fal.ai (shared) | AI/API | Video generation behind the studio surface. `studio.html` labels the step "fal.ai / seedance"; `admin.html` health panel reports `fal-ai/seedance-v1` | Unconfirmed | Unconfirmed | usage-based, per generation | unknown | - | https://fal.ai | usage-based | n/a | backend-side (FAL_API_KEY) | Needs Verification | 2026-08-09 (added) |
| Tavus Phoenix | AI/API | **Deprecated.** Referenced in a design brief for age-progressed avatar generation | Unconfirmed | Unconfirmed | unconfirmed | no | tavusapi.com | tavusapi.com | unconfirmed | n/a | backend-side | Deprecated | 2026-08-09 |

## Stale user-facing copy (2026-08-09, still unfixed)

`dashboard.html:2234` shows real users: **"Tavus Phoenix is aging your photo. ~2-5 min."** The live pipeline is Runway, confirmed by Lee and by the substantive Runway comments elsewhere in the same file (room billing, worker boot, session rotation). This is a customer-visible reference to a provider no longer in the stack. Flagged 2026-08-08, still open, wording is Lee's call.

## Open items

- [ ] Fix the stale Tavus loading string at `dashboard.html:2234`.
- [ ] Billing entity audit: confirm whether Netlify and the domain bill to Frisson Digital, Inc. or elsewhere.
- [ ] Confirm registrar and renewal date for studioyou.app. A lapse takes the product down.
- [ ] The 92-file checkpoint commit (`54c6458`) still has not had a file-by-file review. Flagged 2026-08-07, still open.
