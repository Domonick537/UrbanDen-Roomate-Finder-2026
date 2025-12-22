# Netlify Deployment - Blank Screen Fix

## Most Common Issue: Missing Environment Variables

If you see a blank/white screen, it's almost always because environment variables aren't set in Netlify.

### Fix: Add Environment Variables to Netlify

1. **Go to your Netlify site dashboard**
2. **Click "Site settings"**
3. **Click "Environment variables" in the left sidebar**
4. **Click "Add a variable"** and add these TWO variables:

   ```
   Key: EXPO_PUBLIC_SUPABASE_URL
   Value: https://krkueqlqystokpitnane.supabase.co
   ```

   ```
   Key: EXPO_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya3VlcWxxeXN0b2twaXRuYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzc3MzMsImV4cCI6MjA4MTg1MzczM30.HLtm4ve-QQSvaQ5cEw0FNt-KnSqoz1iI0SNBQ3zFJeY
   ```

5. **Click "Save"**
6. **Trigger a new deploy:**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

7. **Wait 2-3 minutes** for the deployment to complete

## Verification Steps

After redeploying with environment variables:

1. **Open your site**
2. **Open browser console** (F12 or Right-click → Inspect)
3. **Look for errors:**
   - If you see Supabase connection errors → Environment variables might be wrong
   - If you see "undefined" errors → Variables aren't being loaded
   - If no errors and app loads → Success!

## Additional Troubleshooting

### Still seeing a blank screen?

1. **Check the browser console for specific errors**
2. **Verify the deploy log in Netlify:**
   - Go to "Deploys" tab
   - Click on the latest deploy
   - Check for any build errors

3. **Clear your browser cache:**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private mode

4. **Check Netlify deploy logs:**
   - Make sure the build succeeded
   - Look for "Exported: dist" message
   - Verify no errors during build

### Environment Variable Format Issues

Make sure:
- Variable names are EXACTLY: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- No extra spaces before or after the values
- No quotes around the values (Netlify adds them automatically)

### Still Having Issues?

1. Check browser console (F12) for specific errors
2. Check Netlify function logs if using edge functions
3. Verify Supabase is accessible from the deployed URL
4. Make sure you triggered a NEW deploy after adding variables (old deploys won't have them)

## Quick Test

After deployment, open browser console and type:
```javascript
console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)
```

- If it shows `undefined` → Environment variables aren't loaded
- If it shows the URL → Environment variables are working

## Summary

**The fix is simple:**
1. Add the two environment variables to Netlify
2. Clear cache and redeploy
3. Wait for deployment to complete
4. Refresh your browser

99% of blank screen issues are resolved by adding environment variables correctly.
