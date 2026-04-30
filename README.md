# PRSense — AI-powered GitHub PR Reviewer

> Chrome extension + SaaS backend. Adds an "AI review" button to every GitHub pull request. Click it and get a structured summary: what changed, risk areas, suggested questions to ask the author, and a complexity score. Review history saved in a dashboard.

![Status](https://img.shields.io/badge/status-planning-lightgrey)
![Stack](https://img.shields.io/badge/stack-Manifest%20V3%20%7C%20Next.js%20%7C%20OpenRouter-blue)

🔗 **Live demo:** _coming soon_
🔌 **Chrome Web Store:** _coming soon_

---

## Why this project

Code review is repetitive and slow. Every reviewer scans the diff, hunts for risky changes, decides what to ask, drafts feedback. The first 80% of that work is mechanical.

PRSense automates that 80%:

1. **Install the extension** — adds a "PRSense Review" button to GitHub PR pages.
2. **Click the button on any PR** — extension grabs the diff via GitHub API, sends to backend.
3. **Backend runs structured analysis with Claude/GPT-4** — change summary, risk hotspots, complexity score (lines × file count × test coverage), suggested review questions.
4. **Result renders inline below the PR description** — reviewer reads, copy-pastes the relevant questions as a comment, ships review in 2 minutes instead of 20.
5. **Dashboard SaaS** at `prsense.app` — history of all reviews, team analytics (avg complexity per PR, risk trends), exports.

Free plan: 5 reviews/month. Pro: $19/mo unlimited + team analytics.

---

## Architecture

```
┌──────────────────┐  GitHub diff API   ┌──────────────────┐
│ Chrome Extension │  ───────────────▶  │ GitHub REST/GQL  │
│ (Manifest V3)    │                    │ (user OAuth)     │
└────────┬─────────┘                    └──────────────────┘
         │ diff payload + auth token
         ▼
┌──────────────────┐  structured prompt  ┌──────────────────┐
│   SaaS backend   │  ─────────────────▶ │   OpenRouter     │
│   (Next.js)      │  ◀──────────────────│   (Claude/GPT-4) │
│                  │  JSON review object └──────────────────┘
│  - Auth (Clerk)  │
│  - DB (Neon)     │  persist review history per user/repo
│  - Stripe        │
└──────────────────┘
```

### Why Manifest V3

V2 is deprecated. New extensions must use V3 — service workers (no persistent background page), declarative content scripts, host_permissions opt-in. PRSense uses:

- **Service worker** for GitHub API calls and backend communication.
- **Content script** injected only on `https://github.com/*/pull/*` URLs.
- **`chrome.identity.launchWebAuthFlow`** for GitHub OAuth (PKCE) — token never touches the page.

### Why structured output (not free-form chat)

Free-form review summaries vary widely in quality and shape. PRSense forces JSON schema:

```ts
type Review = {
  summary: string;           // 2-3 sentences
  risk_areas: { file: string; concern: string; severity: 'low'|'med'|'high' }[];
  complexity_score: number;  // 0-100
  questions_for_author: string[];  // max 5
  test_coverage_note: string;
};
```

The model is prompted with `response_format: json_schema`. Reliable rendering, easy diffing across reviews, queryable in the dashboard.

---

## Tech stack

| Layer            | Technology                                       |
|------------------|--------------------------------------------------|
| Browser extension| TypeScript, Manifest V3, esbuild, CRXJS plugin   |
| SaaS frontend    | Next.js 14 (App Router), TypeScript, Tailwind    |
| Auth             | Clerk (SaaS) + GitHub OAuth (extension → API)    |
| Database         | PostgreSQL (Neon)                                |
| LLM              | OpenRouter (Claude 3.5 Sonnet primary, GPT-4o-mini fallback) |
| Billing          | Stripe                                           |
| Deploy           | Vercel (web) + Chrome Web Store (extension)      |

---

## Project layout (planned)

```
prsense/
├── extension/                  # Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── src/
│   │   ├── background.ts       # service worker — auth, API calls
│   │   ├── content.ts          # injected on GitHub PR pages
│   │   ├── ui/Review.tsx       # in-page review panel (Shadow DOM)
│   │   └── lib/api.ts          # backend client
│   └── vite.config.ts
├── web/                        # Next.js SaaS dashboard
│   ├── src/app/
│   │   ├── page.tsx            # landing
│   │   ├── dashboard/page.tsx  # review history + analytics
│   │   ├── api/
│   │   │   ├── review/route.ts # POST diff → structured review
│   │   │   ├── reviews/route.ts# GET history
│   │   │   └── billing/        # Stripe checkout/portal/webhook
│   │   └── auth/[...]
│   └── ...
└── shared/                     # types shared between extension + web
    └── review-schema.ts
```

---

## Roadmap

### Milestone 1 — Extension MVP
- [ ] Manifest V3 scaffold with CRXJS + Vite
- [ ] Inject "PRSense Review" button on GitHub PR pages
- [ ] GitHub OAuth via `chrome.identity` + PKCE
- [ ] Fetch diff via GitHub REST API
- [ ] Backend `/api/review` endpoint (POST diff → structured JSON)
- [ ] Render review panel inline (Shadow DOM to avoid CSS leakage)

### Milestone 2 — SaaS dashboard
- [ ] Clerk auth + user onboarding
- [ ] DB schema (users, reviews, repositories)
- [ ] Dashboard listing past reviews with filters
- [ ] Per-repo analytics (avg complexity, risk trend chart)

### Milestone 3 — Billing + ship
- [ ] Stripe checkout + customer portal + webhook
- [ ] Free-tier limit enforcement (5 reviews/month)
- [ ] Pro plan ($19/mo)
- [ ] Vercel deploy
- [ ] Chrome Web Store submission

### Milestone 4 — Loom + Upwork ready
- [ ] Loom 90s demo: install extension → review real PR → see dashboard
- [ ] README with screenshots + architecture diagram
- [ ] Open-source the schema package on npm (`@prsense/schema`)

---

## Niche alternatives (if PRSense doesn't ship)

The `extension/` shell + auth + SaaS skeleton is generic. Same architecture serves:

- **TweetMiner** — extract X.com threads → AI thread summary + saved library.
- **LinkPulse** — LinkedIn post analyzer → engagement prediction + draft polishing.
- **PriceWatch** — Shopify/Amazon price tracker → alert when below target.

Each has the same Manifest V3 + Next.js + Stripe shape. Pivot is mostly content script + prompt change.

---

## License

MIT (planned)

## Author

[Rafaela Santos](https://github.com/rafaelasantosfeitosa)
