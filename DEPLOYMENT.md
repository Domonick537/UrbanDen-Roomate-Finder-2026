# UrbanDen Roommate Finder - Deployment Guide

## Quick Deploy to Netlify

Your app is ready to launch! Follow these steps:

### Step 1: Push to GitHub

```bash
# Navigate to your project directory and run:
git remote add origin https://github.com/Domonick537/UrbanDen-Roomate-Finder-2026.git
git push -u origin main
```

**Authentication Options:**
- **Personal Access Token**: GitHub Settings → Developer settings → Personal access tokens
- **GitHub CLI**: Run `gh auth login` first
- **SSH**: Use `git@github.com:Domonick537/UrbanDen-Roomate-Finder-2026.git`

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://app.netlify.com)**
   - Sign up or log in with your GitHub account

2. **Import Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your repository: `Domonick537/UrbanDen-Roomate-Finder-2026`

3. **Configure Build Settings** (Auto-detected)
   - Build command: `npm run build:web`
   - Publish directory: `dist`
   - Node version: 18

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add these variables:
     ```
     EXPO_PUBLIC_SUPABASE_URL=https://krkueqlqystokpitnane.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya3VlcWxxeXN0b2twaXRuYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNzc3MzMsImV4cCI6MjA4MTg1MzczM30.HLtm4ve-QQSvaQ5cEw0FNt-KnSqoz1iI0SNBQ3zFJeY
     ```

5. **Deploy!**
   - Click "Deploy site"
   - Your app will be live in 2-3 minutes at `your-site-name.netlify.app`

### Step 3: Configure Custom Domain (Optional)

1. In Netlify, go to Domain settings
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Alternative Deployment Platforms

### Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables
4. Deploy

### Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub account
3. Select your repository
4. Build command: `npm run build:web`
5. Output directory: `dist`
6. Add environment variables
7. Deploy

## Project Features

Your UrbanDen Roommate Finder includes:

✅ **Authentication System**
- Email/password signup and login via Supabase Auth
- Password reset functionality
- Onboarding flow for new users

✅ **Profile Management**
- Complete profile creation with preferences
- Photo upload (up to 6 photos)
- Profile completion tracking
- Identity verification system

✅ **Matching System**
- Smart algorithm matching compatible roommates
- Filter by location, budget, lifestyle preferences
- Like/pass on potential matches
- Match celebration animations

✅ **Messaging**
- Real-time chat with matches
- Read receipts and typing indicators
- Message history

✅ **Safety Features**
- User blocking
- Report system for inappropriate behavior
- Admin dashboard for content moderation
- Safety tips and guidelines

✅ **Data Management**
- Export your data (privacy compliance)
- Account deletion
- Supabase backend with Row Level Security

## Environment Setup

Make sure your `.env` file contains:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

The Supabase database is already configured with:
- User profiles and preferences
- Matching system tables
- Chat/messaging infrastructure
- Safety features (blocks, reports)
- Admin roles and permissions
- Storage buckets for photos

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web
npm run build:web
```

## Next Steps

1. Push your code to GitHub
2. Set up environment variables in your deployment platform
3. Configure Supabase project settings
4. Test the app on mobile devices
5. Submit to app stores (requires Expo build)

For mobile builds, you'll need to create a development build using Expo Dev Client.

## Post-Deployment Checklist

After your site is live:

- [ ] Test authentication (signup, login, logout)
- [ ] Verify Supabase connection
- [ ] Test profile creation and photo uploads
- [ ] Check matching functionality
- [ ] Test real-time chat
- [ ] Verify all safety features work
- [ ] Test on mobile browsers
- [ ] Set up custom domain (optional)
- [ ] Enable SSL/HTTPS (automatic on most platforms)
- [ ] Configure Supabase URL redirects for auth

## Supabase Configuration

After deploying, update your Supabase project:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Authentication → URL Configuration
4. Add your deployment URL to:
   - Site URL: `https://your-site-name.netlify.app`
   - Redirect URLs: `https://your-site-name.netlify.app/**`

## Troubleshooting

**Build Fails**
- Check that all environment variables are set correctly
- Verify Node version is 18 or higher
- Clear cache and redeploy

**Authentication Not Working**
- Verify Supabase environment variables are correct
- Check Supabase URL configuration includes your deployment URL
- Ensure CORS is properly configured in Supabase

**Photos Not Uploading**
- Check Supabase Storage is configured
- Verify storage bucket policies are set correctly
- Ensure the anon key has proper permissions

**Real-time Chat Issues**
- Verify Supabase realtime is enabled
- Check RLS policies on messages table
- Ensure WebSocket connections are allowed

## Support

- Repository: https://github.com/Domonick537/UrbanDen-Roomate-Finder-2026
- Expo Docs: https://docs.expo.dev
- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
