# UrbanDen - Quick Start Guide

## Deploy in 5 Minutes

### 1. Push to GitHub (1 min)
```bash
git push -u origin main
```

### 2. Deploy to Netlify (2 min)
1. Go to [netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select: `Domonick537/UrbanDen-Roomate-Finder-2026`
4. Netlify will auto-detect settings from `netlify.toml`

### 3. Add Environment Variables (2 min)
In Netlify Site settings → Environment variables, add:

```
EXPO_PUBLIC_SUPABASE_URL=https://krkueqlqystokpitnane.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya3VlcWxxeXN0b2twaXRuYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzc3MzMsImV4cCI6MjA4MTg1MzczM30.HLtm4ve-QQSvaQ5cEw0FNt-KnSqoz1iI0SNBQ3zFJeY
```

### 4. Deploy & Configure (Auto)
- Click "Deploy site"
- Wait 2-3 minutes
- Your app is live at `your-site-name.netlify.app`

### 5. Update Supabase (Final Step)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Authentication → URL Configuration
3. Add your Netlify URL:
   - Site URL: `https://your-site-name.netlify.app`
   - Redirect URLs: `https://your-site-name.netlify.app/**`

## Done!

Your UrbanDen Roommate Finder is now live and ready to use.

**Test it:**
- Visit your Netlify URL
- Create an account
- Complete your profile
- Start matching with roommates

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.
