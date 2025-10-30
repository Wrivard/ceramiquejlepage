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

### 3. Add Secret Key to Vercel
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Add:**
   - Name: `RECAPTCHA_SECRET_KEY`
   - Value: `Your_Actual_Secret_Key`

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

## 🔧 Current Placeholders to Replace:
- `RECAPTCHA_SITE_KEY` → Add to Vercel environment variables
- `RECAPTCHA_SECRET_KEY` → Add to Vercel environment variables

## 🌐 Domains to allow in Google reCAPTCHA admin
- `ceramiquesjlepage.ca`
- Add `www.ceramiquesjlepage.ca` if you serve on the www subdomain
- Add your Vercel preview domain(s) if testing previews: `<project>.vercel.app`
