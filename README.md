# Eleganote marketing website

Static landing site for **Eleganote**: feature gallery, store download links, Firebase sign-in, and Premium checkout via the existing subscription API.

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | Tagline, platforms, CTA |
| **Features** | Gallery of app capabilities (EN / AR) |
| **Premium** | Plans ($4.99 / $9.99 / $29.99), card & crypto checkout |
| **Account** | Email/password + Google sign-in (Firebase) |
| **Download** | Play Store / App Store / desktop links |

## Local preview

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

## Configuration (`js/config.js`)

1. **Firebase Web app** — Firebase Console → Project `eleganote-dbd15` → Add Web app → copy `appId` into `firebase.appId`.
2. **Authorized domains** — Authentication → Settings → add your domain (e.g. `localhost`, `your-user.github.io`).
3. **Store URLs** — Set `stores.play`, `stores.appStore`, `stores.desktop`.
4. **Subscription API** — Default: `https://eleganote-subscription.onrender.com` (same as the Flutter app).

## Deploy (public website repo + eleganote.com)

The Flutter app stays in the **private** `Eleganote` repo. The marketing site is published to a **separate public** repo:

**https://github.com/anasraad6888-png/eleganote.com**

CI (`.github/workflows/deploy-website.yml`) syncs `website/` → `docs/` in Eleganote, then deploys `docs/` to the root of `eleganote.com`.

**One-time setup:** see [`.github/WEBSITE_REPO_SETUP.md`](../.github/WEBSITE_REPO_SETUP.md) (Arabic). Quick steps:

1. Create empty public repo `eleganote.com`
2. Run `./tool/bootstrap_website_public_repo.sh` (or let CI deploy after step 3)
3. Add secret `WEBSITE_DEPLOY_TOKEN` (fine-grained PAT, write access to `eleganote.com`) on **Eleganote**
4. On **eleganote.com** → Settings → Pages → `main` → **`/ (root)`** → custom domain `eleganote.com` → Enforce HTTPS

**DNS at Tricasol:**

| Type | Name | Value |
|------|------|--------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `anasraad6888-png.github.io` |

**Firebase:** Authentication → Authorized domains → add `eleganote.com` and `www.eleganote.com`. Set real Web `appId` in `js/config.js`.

## Payments

- **Card (Gammal)** — all paid plans; redirects to Gammal payment link from the API.
- **Crypto (NOWPayments)** — yearly plan only; same rules as the app.

After payment, user taps **Refresh status** on the site or in the app (Profile → Premium).

## Privacy & legal

Legal pages live in this folder: `privacy.html`, `account-deletion.html`.
