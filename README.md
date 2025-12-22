# UrbanDen - Roommate Finder App

A modern roommate finder application built with Expo and React Native, designed for web deployment now with mobile-ready infrastructure for future expansion.

## Architecture

### Technology Stack
- **Expo + Expo Router** - Cross-platform framework (web, iOS, Android)
- **React Native Web** - Enables the same codebase to run on web and mobile
- **Supabase** - PostgreSQL database with real-time capabilities
- **TypeScript** - Type safety across the application
- **AsyncStorage** - Local storage for session management

### Why This Approach?

This app is built using **Expo's web support** rather than a pure web framework. This means:

1. **Same codebase for web and mobile** - When you're ready to deploy to iOS/Android, the existing code will work with minimal changes
2. **React Native components** - Uses React Native components that are automatically converted to web-compatible versions via React Native Web
3. **Expo Router** - File-based routing system that works across all platforms
4. **Future-proof** - Easy transition to mobile apps when needed

## Database Structure

### Supabase Tables

1. **profiles** - User profile information
   - Basic info: name, age, gender, occupation, bio
   - Verification status
   - Profile pictures and photos

2. **roommate_preferences** - User preferences for finding roommates
   - Budget range
   - Location (state, city, neighborhood)
   - Move-in date
   - Lifestyle preferences (pets, smoking, drinking, cleanliness, social level)

3. **matches** - Matched users
   - Two user IDs
   - Compatibility score
   - Last message timestamp

4. **messages** - Chat messages between matches
   - Match ID
   - Sender ID
   - Content and timestamp

5. **swipe_actions** - User swipe history (like/pass)
   - Prevents showing the same users repeatedly

All tables have Row Level Security (RLS) policies to ensure users can only access their own data and data from their matches.

## Running the Application

### Development (Web)
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:8081`

### Build for Web
```bash
npm run build:web
```

Outputs to the `dist` folder, ready for deployment to any static hosting service.

### Future: Mobile Development
```bash
# iOS
npm run ios

# Android
npm run android
```

## Key Features

### Discover
- Tinder-style swipe interface
- View potential roommates with compatibility scores
- See detailed profiles with preferences

### Matches
- View all your matches
- Search through matches
- Quick access to chat

### Profile
- Manage your profile information
- Set roommate preferences
- View verification status

### Settings
- Notification preferences
- Account management

### Chat
- Real-time messaging with matches
- Message history stored in Supabase

## Data Flow

1. **Authentication Flow** (To be implemented)
   - Currently uses mock data with temporary user selection
   - Ready for Supabase Auth integration

2. **User Data**
   - Stored in Supabase `profiles` and `roommate_preferences` tables
   - Current user ID stored in AsyncStorage for session management

3. **Matching System**
   - Compatibility calculated based on preferences
   - Swipe actions stored to prevent repeat viewings
   - Mutual likes create matches

4. **Messaging**
   - Messages stored in Supabase
   - Can be enhanced with real-time subscriptions

## Environment Variables

Located in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Project Structure

```
├── app/                    # Expo Router file-based routing
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   ├── chat/              # Chat screens
│   ├── profile/           # Profile management
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── services/              # Business logic
│   ├── supabase.ts       # Supabase client
│   ├── storage.ts        # Data management
│   ├── matching.ts       # Matching algorithm
│   ├── mockData.ts       # Mock data for testing
│   └── locationData.ts   # Location utilities
├── types/                 # TypeScript definitions
└── hooks/                 # Custom React hooks
```

## Next Steps for Production

1. **Authentication**
   - Integrate Supabase Auth
   - Add email/password signup
   - Implement social login (optional)

2. **Image Upload**
   - Integrate Supabase Storage for profile pictures
   - Add image compression

3. **Real-time Features**
   - Use Supabase real-time subscriptions for live messaging
   - Online status indicators

4. **Mobile Deployment**
   - Build iOS app with `eas build --platform ios`
   - Build Android app with `eas build --platform android`
   - Submit to App Store and Play Store

5. **Additional Features**
   - Push notifications
   - Location-based search with maps
   - Video call integration
   - Background checks and verification

## Development Notes

- Mock data is automatically initialized on first run
- Current user is stored in AsyncStorage by ID
- All database operations use Supabase
- Web platform is the primary target, mobile support is secondary but maintained
- Uses React Native Web to convert React Native components to web-compatible versions
