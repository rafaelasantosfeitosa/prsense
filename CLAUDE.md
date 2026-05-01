# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Planning stage. `extension/`, `web/`, and `shared/` directories exist but are empty. No build, lint, or test commands yet — scaffolding is the first task. Treat README.md as the source of truth for intended architecture until code lands.

## Architecture (planned)

Three-package monorepo with one shared types boundary:

- **`extension/`** — Chrome Manifest V3 extension (TypeScript, Vite + CRXJS). Service worker handles GitHub OAuth (`chrome.identity.launchWebAuthFlow` with PKCE) and backend calls; content script injects only on `https://github.com/*/pull/*` and renders the review panel inside a **Shadow DOM** to avoid GitHub's CSS leaking in. Token never touches the page DOM.
- **`web/`** — Next.js 14 App Router SaaS at `prsense.app`. Routes: `/api/review` (POST diff → structured review via OpenRouter), `/api/reviews` (history), `/api/billing/*` (Stripe). Auth via Clerk. DB: Postgres on Neon.
- **`shared/review-schema.ts`** — single `Review` type (summary, risk_areas, complexity_score 0-100, questions_for_author, test_coverage_note) consumed by both extension and web. Eventually published as `@prsense/schema` on npm.

### Cross-cutting decisions baked into the design

- **Structured LLM output, not free-form.** OpenRouter call uses `response_format: json_schema` against the shared `Review` type. Don't introduce free-form text fields without updating the schema in `shared/` first — both packages depend on its shape.
- **OpenRouter, not direct Anthropic/OpenAI.** Primary model: Claude 3.5 Sonnet, fallback GPT-4o-mini. Routing logic lives server-side in `web/api/review`; extension never sees model choice.
- **Two distinct auth flows.** Extension → backend uses **GitHub OAuth (PKCE)** via `chrome.identity`. Dashboard users authenticate with **Clerk**. Don't conflate them; the `/api/review` endpoint must accept the GitHub-OAuth token from the extension separately from Clerk sessions.
- **Free tier = 5 reviews/month.** Quota enforcement belongs in `/api/review` before the OpenRouter call, keyed off the authenticated user.

## When scaffolding

Follow the layout in README.md "Project layout (planned)" exactly — file paths there are referenced by the architecture diagram and roadmap. The extension uses **Vite + CRXJS** (not webpack/esbuild standalone) per the tech stack table.
