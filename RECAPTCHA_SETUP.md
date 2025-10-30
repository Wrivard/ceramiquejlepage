# 🔐 reCAPTCHA v3 Setup Instructions

## 🎯 Current Status
- ❌ Using test keys (shows "testing only")
- ✅ Code is ready for production keys

## 📋 Steps to Fix:

### 1. Get Real reCAPTCHA Keys
1. Go to: https://www.google.com/recaptcha/admin
2. **Create New Site** or select existing
3. **Choose reCAPTCHA v3**
4. **Add your domain**: `your-site.vercel.app`
5. **Copy the keys**:
   - Site Key (public): `6Lc...` 
   - Secret Key (private): `6Lc...`

### 2. Ensure the script isn’t blocked by Cookiebot (important)
Because Cookiebot runs in auto‑blocking mode, mark the reCAPTCHA script as necessary so it isn’t blocked:

```html
<!-- already implemented in soumission.html -->
<script src="https://www.google.com/recaptcha/api.js" data-cookieconsent="ignore" type="text/javascript" async defer></script>
```

We dynamically fetch the site key from `/api/recaptcha-sitekey` and pass it to `grecaptcha.execute(siteKey, { action: 'submit' })`.

### 3. Environment variables (Vercel)
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Add these for Enterprise verification (serverless):
   - `RECAPTCHA_ENTERPRISE_API_KEY` → Google Cloud API key for reCAPTCHA Enterprise
   - `RECAPTCHA_PROJECT_ID` → Your GCP Project ID (e.g., `kua-prod`) 
   - `RECAPTCHA_ENTERPRISE_SITE_KEY` → Your Enterprise site key (optional, we default to the current site key)

### 4. Deploy Changes
```bash
git add .
git commit -m "Add production reCAPTCHA keys"
git push origin master
```

## ✅ Expected Result:
- No more "testing only" message
- Invisible reCAPTCHA protection
- Form works normally with security

## 🐛 If you get a 400 (verification failed)
1. Confirm API key restrictions include "reCAPTCHA Enterprise API" and HTTP referrers for `ceramiquesjlepage.ca/*` (and `www.` if used).
2. Ensure env vars are deployed (redeploy after changes).
3. Check Vercel logs for `reCAPTCHA Enterprise assessment failed` – it will include assessment details (score, validity).
4. Action name must match: client executes `{ action: 'LOGIN' }` and the server expects `LOGIN`.
5. If needed, raise or lower threshold; default is 0.3 during debugging.

## 🔧 Current Placeholders to Replace:
- `RECAPTCHA_ENTERPRISE_API_KEY`, `RECAPTCHA_PROJECT_ID` → Add to Vercel env
- (Optional) `RECAPTCHA_ENTERPRISE_SITE_KEY` → Add to Vercel env

## 🌐 Domains to allow in Google reCAPTCHA admin
- `ceramiquesjlepage.ca`
- Add `www.ceramiquesjlepage.ca` if you serve on the www subdomain
- Add your Vercel preview domain(s) if testing previews: `<project>.vercel.app`
