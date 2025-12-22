# UrbanDen Roommate Finder - Deployment Guide

## Push to GitHub

Your code is ready to push! Run these commands from your local machine:

```bash
# If you haven't cloned yet, download the project files first

# Then navigate to the project directory and run:
git remote add origin https://github.com/Domonick537/UrbanDen-Roomate-Finder-2026.git
git push -u origin main
```

### Authentication Options

**Option 1: Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope
3. Use the token as your password when prompted

**Option 2: GitHub CLI**
```bash
gh auth login
git push -u origin main
```

**Option 3: SSH**
```bash
git remote set-url origin git@github.com:Domonick537/UrbanDen-Roomate-Finder-2026.git
git push -u origin main
```

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

## Support

- Repository: https://github.com/Domonick537/UrbanDen-Roomate-Finder-2026
- Expo Docs: https://docs.expo.dev
- Supabase Docs: https://supabase.com/docs
