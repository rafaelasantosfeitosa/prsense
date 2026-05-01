# Deploy

## Vercel (web)

1. Push branch to GitHub.
2. Import the repo at https://vercel.com/new — pick "Other" framework if prompted; the `vercel.json` overrides build/install.
3. **Root directory:** keep as repo root (`./`). The `vercel.json` builds only `web/`.
4. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Where | Required |
   |---|---|---|
   | `OPENROUTER_API_KEY` | https://openrouter.ai/keys | yes |
   | `OPENROUTER_MODEL` | default `google/gemini-2.0-flash-001` | no |
   | `OPENROUTER_FALLBACK_MODEL` | default `google/gemini-flash-1.5` | no |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | https://dashboard.clerk.com | yes |
   | `CLERK_SECRET_KEY` | Clerk dashboard | yes |
   | `GITHUB_OAUTH_CLIENT_ID` | https://github.com/settings/developers | for extension |
   | `GITHUB_OAUTH_CLIENT_SECRET` | GitHub OAuth app | for extension |
   | `NEXT_PUBLIC_APP_URL` | e.g. `https://prsense.app` | yes |
   | `FREE_TIER_MONTHLY_QUOTA` | default `5` | no |

5. Add custom domain `prsense.app` under Project → Domains.

## GitHub OAuth App

1. https://github.com/settings/developers → New OAuth App
2. **Homepage URL:** `https://prsense.app`
3. **Authorization callback URL:** `https://<extension-id>.chromiumapp.org/github`
   (Get the extension ID from `chrome://extensions` after loading the unpacked build.)
4. Enable PKCE in app settings if available; copy `Client ID` and generate a `Client Secret`.

## Chrome extension

```bash
pnpm --filter @prsense/extension build
```

Then load `extension/dist` as unpacked at `chrome://extensions`.

To publish:
1. Zip `extension/dist`.
2. Submit at https://chrome.google.com/webstore/devconsole ($5 one-time fee).
