# ⚠️ BLANK SCREEN FIX - READ THIS FIRST ⚠️

## The Problem
Your Netlify deployment shows a blank/white screen because **environment variables are missing**.

## The Solution (Takes 2 minutes)

### Step 1: Add Environment Variables to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Click **"Site settings"** (or **"Site configuration"**)
4. In the left menu, click **"Environment variables"**
5. Click **"Add a variable"** or **"Add environment variables"**

### Step 2: Add These Two Variables

**Variable 1:**
```
Name: EXPO_PUBLIC_SUPABASE_URL
Value: https://krkueqlqystokpitnane.supabase.co
```

**Variable 2:**
```
Name: EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya3VlcWxxeXN0b2twaXRuYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzc3MzMsImV4cCI6MjA4MTg1MzczM30.HLtm4ve-QQSvaQ5cEw0FNt-KnSqoz1iI0SNBQ3zFJeY
```

**IMPORTANT:**
- Copy the FULL value including the long JWT token
- Don't add quotes - Netlify handles that
- Make sure there are NO spaces before or after

### Step 3: Redeploy

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. Wait 2-3 minutes for build to complete

### Step 4: Verify

1. Open your site URL
2. You should see the UrbanDen app loading
3. If still blank, **clear your browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

## Why This Happens

- Expo apps need environment variables at **build time**
- Local `.env` file doesn't transfer to Netlify
- You must manually add them in Netlify dashboard
- Without these, the app can't connect to Supabase and fails silently

## Screenshots of Where to Add Variables

### In Netlify Dashboard:
```
Site Settings → Build & deploy → Environment → Environment variables
OR
Site Configuration → Environment variables
```

### The Variables Section Should Look Like:
```
EXPO_PUBLIC_SUPABASE_URL = https://krkueqlqystokpitnane.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Still Not Working?

### Check Browser Console:
1. Right-click → Inspect (or press F12)
2. Go to "Console" tab
3. Look for red errors
4. Common errors and fixes:
   - "Cannot read property of undefined" → Variables not loaded, redeploy
   - "Failed to fetch" → Check Supabase URL is correct
   - "Network error" → Check internet connection

### Verify Variables Were Set:
1. In Netlify, go to latest deploy
2. Click "Deploy log"
3. Should show: `env: export EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. If not, variables weren't loaded - try adding them again

## Quick Checklist

- [ ] Added EXPO_PUBLIC_SUPABASE_URL variable in Netlify
- [ ] Added EXPO_PUBLIC_SUPABASE_ANON_KEY variable in Netlify
- [ ] Values are exactly as shown above (no extra spaces)
- [ ] Triggered a NEW deploy (not just republished old one)
- [ ] Waited for deploy to complete (2-3 minutes)
- [ ] Cleared browser cache or opened in incognito mode
- [ ] Checked browser console for errors

## Need More Help?

If you've done all the above and still see blank screen:

1. Share the error from browser console (F12)
2. Share screenshot of your Netlify environment variables page
3. Share the deploy log from Netlify

**This fixes 99% of blank screen issues. The key is ensuring environment variables are in Netlify BEFORE deploying.**
