# SERVICES.md - StudioYou App (client)

Every external platform/service this project depends on. Update at session close whenever something changes. Credentials are NEVER stored here, pointer only. Mirrored into the cross-project Notion Platform & Service Registry (`https://app.notion.com/p/dd60c5c5ccda496eb10d58f8db0bc8b6`) at session close per the `dev-session-protocol` skill.

## Corporate / billing structure (recorded 2026-08-09)

**Frisson Digital, Inc. is the parent company and owns both StudioYou and SCREENBot.** This supersedes the earlier per-product newco plan (StudioYou Inc., Delaware C-corp, with SCP Inc. as venture studio) still described in `studioyou-backend/CLAUDE.md`. A single parent owning both products aligns with incubator programs, Anthropic's programs, and fundraising opportunities.

**Confirmed by Lee 2026-08-09:** every paid resource is personally funded by Lee on personal cards. No platform account bills to a company instrument today, which is why `Billing Entity` reads `Lee (personal)` throughout. SCP Inc. owns nothing and has no IP assigned to it. StudioYou and SCREENBot each have executed IP assignment documentation to Frisson Digital, Inc.; they are the two assigned products. StudioYou and SCREENBot remain **independent products** under a common parent, so shared tooling must not assume a shared codebase or runtime.

**Gap:** Frisson owns the IP, Lee's personal cards fund the infrastructure it runs on. That mismatch is the kind of thing raised in incubator and fund diligence. Counsel and accountant question, flagged here, not advice.

**Target state:** every billing instance established through Frisson Digital, Inc.

## Schema note (2026-08-09)

Four columns added: `Billing Entity`, `Account Standing`, `Cost / Balance`, `Blocks Alpha`. Before this the format had nowhere to record an unpaid or exhausted account.

## Services

| Service | Category | Purpose | Billing Entity | Account Standing | Cost / Balance | Blocks Alpha | Account / Org ID | Console URL | Subscription / Tier | Renewal | Credential Location | Status | Last Verified |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GitHub - studioyou-app | Other | Source code, CLAUDE.md, handoffs/ | Free / no billing | Free tier | $0 | no | github.com/supercreativepeople | https://github.com/supercreativepeople/studioyou-app | free | n/a | git credential helper (osxkeychain, de-tokenized 2026-08-07) | Active | 2026-08-07 |
| Netlify | Distribution/Deploy | Frontend host, studioyou.app | Lee (personal) | Unconfirmed | unconfirmed | no | app.netlify.com | app.netlify.com | unconfirmed tier | n/a | Netlify login (`.netlify/` local config present) | Active | not independently re-verified |
| Domain - studioyou.app | Domain/DNS | Primary product domain | Lee (personal) | Unconfirmed | unconfirmed | no | - | - | unconfirmed | **unknown** | registrar login | Needs Verification | 2026-08-09 (added) |
| Cloud Run - studioyou-api (shared) | Hosting | Backend the client calls, see studioyou-backend/SERVICES.md | Lee (personal) | Unconfirmed | usage-based | no | neat-tangent-474222-m9 | console.cloud.google.com/run | pay-as-you-go | n/a | n/a (backend-side) | Active | not independently re-verified |
| LiveKit (shared) | Realtime | Live avatar conversation rooms, consumed by dashboard/studio pages | Lee (personal) | **Balance due** | **$50 outstanding, unpaid** | **YES** | studioyou-futureyou-avatar-749nqz32.livekit.cloud | cloud.livekit.io | unconfirmed | n/a | client-side token minted by backend | Active | 2026-08-09 |
| Runway (shared) | AI/API | Avatar rendering behind the dashboard avatar flow | Lee (personal) | **Credits exhausted** | **needs top-up, amount TBD** | **YES** | - | runwayml.com | unconfirmed | n/a | agent-side (studioyou-fy-agent/.env) | Active | 2026-08-09 |
| Fal.ai (shared) | AI/API | Video generation behind the studio surface. `studio.html` labels the step "fal.ai / seedance"; `admin.html` health panel reports `fal-ai/seedance-v1` | Lee (personal) | Unconfirmed | usage-based, per generation | unknown | - | https://fal.ai | usage-based | n/a | backend-side (FAL_API_KEY) | Needs Verification | 2026-08-09 (added) |
| Tavus Phoenix | AI/API | **Deprecated.** Referenced in a design brief for age-progressed avatar generation | Lee (personal) | Unconfirmed | unconfirmed | no | tavusapi.com | tavusapi.com | unconfirmed | n/a | backend-side | Deprecated | 2026-08-09 |

## Stale user-facing copy (2026-08-09, still unfixed)

`dashboard.html:2234` shows real users: **"Tavus Phoenix is aging your photo. ~2-5 min."** The live pipeline is Runway, confirmed by Lee and by the substantive Runway comments elsewhere in the same file (room billing, worker boot, session rotation). This is a customer-visible reference to a provider no longer in the stack. Flagged 2026-08-08, still open, wording is Lee's call.

## Open items

- [ ] Fix the stale Tavus loading string at `dashboard.html:2234`.
- [ ] Billing entity audit: confirm whether Netlify and the domain bill to Frisson Digital, Inc. or elsewhere.
- [ ] Confirm registrar and renewal date for studioyou.app. A lapse takes the product down.
- [ ] The 92-file checkpoint commit (`54c6458`) still has not had a file-by-file review. Flagged 2026-08-07, still open.

## Asset class correction (2026-08-09)

`Lee (personal)` in the Billing Entity column is **not** a defect on every row. Lee operates as an independent builder; his personal accounts and cards fund his own activities and have never been commingled with SCP Inc. or any other company. Personal tooling on a personal card is correct and stays that way.

The real finding is **asset control**: which accounts a Frisson-owned product cannot operate without, while being held in Lee's personal name. The IP assignment moved StudioYou and SCREENBot to Frisson; it did not move the domain registrations, platform accounts, or API keys those products run on. That is a completeness gap in the assignment, not a hygiene failure.

Separately: every vendor account was signed up via `supercreativepeople@gmail.com` with the company name listed as **"SuperCreativePeople"** (name only, no EIN, no entity linkage). SCP Inc. is the one entity deliberately excluded from every program application, so having it named on the infrastructure is a needless inconsistency. **Decision: strip the SCP name now; do not replace with Frisson until Frisson has a payment instrument.** Do not touch GCP billing account `019309-BEB782-398472` while the Google for Startups application is under review.

Full analysis, the company-dependent asset list, and the open items live in `studioyou-backend/SERVICES.md`.
