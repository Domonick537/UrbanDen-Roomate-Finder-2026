# 🚀 YOUR APP IS BLANK? HERE'S THE FIX! 🚀

## YOU FORGOT TO ADD ENVIRONMENT VARIABLES TO NETLIFY!

### DO THIS RIGHT NOW (2 minutes):

## 📍 Step 1: Go to Netlify Environment Variables

1. Open: https://app.netlify.com
2. Click your site
3. Click **"Site configuration"** or **"Site settings"**
4. Click **"Environment variables"** in the left menu

## 📍 Step 2: Click "Add a variable" and add BOTH of these:

### Variable #1:
```
Key/Name: EXPO_PUBLIC_SUPABASE_URL
Value: https://krkueqlqystokpitnane.supabase.co
```

### Variable #2:
```
Key/Name: EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya3VlcWxxeXN0b2twaXRuYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzc3MzMsImV4cCI6MjA4MTg1MzczM30.HLtm4ve-QQSvaQ5cEw0FNt-KnSqoz1iI0SNBQ3zFJeY
```

**⚠️ COPY THE ENTIRE VALUE INCLUDING THE LONG TOKEN! ⚠️**

## 📍 Step 3: Save and Redeploy

1. Click **"Save"**
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Wait 2-3 minutes

## 📍 Step 4: Clear Your Browser Cache

- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R
- **Or**: Open in incognito/private browsing mode

## ✅ Your App Will Now Work!

---

## Why is my screen blank?

**Simple answer:** Netlify doesn't have your Supabase connection info.

Your local `.env` file doesn't automatically transfer to Netlify. You must manually add these environment variables in the Netlify dashboard.

## Where exactly do I add these?

### Netlify Classic UI:
`Site Settings → Build & deploy → Environment → Environment variables`

### Netlify New UI:
`Site configuration → Environment variables`

## I added them but it's still blank!

**Did you redeploy?** Old deploys don't have the variables. You must:
1. Trigger a NEW deploy after adding variables
2. Wait for it to complete (check Deploys tab)
3. Hard refresh your browser (Ctrl+Shift+R)

## How do I know it worked?

When you open your site:
- You'll see a loading spinner briefly
- Then the UrbanDen welcome/login screen appears
- No more blank white screen!

## Still having issues?

**Check browser console (F12):**
- Look for errors in red
- If you see "undefined" errors → variables not loaded, redeploy
- If you see "Failed to fetch" → check variable values are correct

**The most common mistake:**
- Not copying the FULL anon key (it's very long!)
- Having extra spaces in the values
- Not triggering a new deploy after adding variables

---

# TL;DR

1. Add 2 environment variables to Netlify (shown above)
2. Redeploy
3. Hard refresh browser
4. Done!

**This is a 2-minute fix that solves the blank screen issue!**
