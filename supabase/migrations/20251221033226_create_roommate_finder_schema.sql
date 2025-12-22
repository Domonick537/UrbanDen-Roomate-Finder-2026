/*
  # Roommate Finder Database Schema

  ## Tables Created

  1. profiles
    - id (uuid, references auth.users)
    - first_name (text)
    - age (integer)
    - gender (text)
    - occupation (text)
    - profile_picture (text, URL)
    - bio (text)
    - phone (text, nullable)
    - is_verified (boolean)
    - is_email_verified (boolean)
    - is_phone_verified (boolean)
    - created_at (timestamptz)
    - last_active (timestamptz)
    - photos (text array)

  2. roommate_preferences
    - id (uuid)
    - user_id (uuid, references profiles)
    - gender_preference (text)
    - budget_min (integer)
    - budget_max (integer)
    - state (text)
    - city (text)
    - neighborhood (text, nullable)
    - move_in_date (text)
    - move_in_date_specific (timestamptz, nullable)
    - pet_preference (text)
    - smoking_preference (text)
    - drinking_preference (text)
    - cleanliness (text)
    - social_level (text)

  3. matches
    - id (uuid)
    - user_id_1 (uuid, references profiles)
    - user_id_2 (uuid, references profiles)
    - compatibility (integer)
    - created_at (timestamptz)
    - last_message_at (timestamptz, nullable)

  4. messages
    - id (uuid)
    - match_id (uuid, references matches)
    - sender_id (uuid, references profiles)
    - content (text)
    - created_at (timestamptz)
    - is_read (boolean)

  5. swipe_actions
    - id (uuid)
    - user_id (uuid, references profiles)
    - target_user_id (uuid, references profiles)
    - action (text: 'like' or 'pass')
    - created_at (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'non-binary')),
  occupation text NOT NULL,
  profile_picture text,
  bio text NOT NULL DEFAULT '',
  phone text,
  is_verified boolean DEFAULT false,
  is_email_verified boolean DEFAULT false,
  is_phone_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  photos text[] DEFAULT ARRAY[]::text[]
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create roommate_preferences table
CREATE TABLE IF NOT EXISTS roommate_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gender_preference text NOT NULL CHECK (gender_preference IN ('male', 'female', 'any')),
  budget_min integer NOT NULL DEFAULT 0,
  budget_max integer NOT NULL DEFAULT 0,
  state text NOT NULL,
  city text NOT NULL,
  neighborhood text,
  move_in_date text NOT NULL CHECK (move_in_date IN ('urgent', 'flexible', '2-3months', 'other')),
  move_in_date_specific timestamptz,
  pet_preference text NOT NULL CHECK (pet_preference IN ('love-pets', 'no-pets', 'allergic', 'flexible')),
  smoking_preference text NOT NULL CHECK (smoking_preference IN ('smoker', 'non-smoker', 'flexible')),
  drinking_preference text NOT NULL CHECK (drinking_preference IN ('social-drinker', 'non-drinker', 'flexible')),
  cleanliness text NOT NULL CHECK (cleanliness IN ('very-clean', 'clean', 'flexible')),
  social_level text NOT NULL CHECK (social_level IN ('very-social', 'sometimes', 'quiet', 'flexible')),
  UNIQUE(user_id)
);

ALTER TABLE roommate_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all preferences"
  ON roommate_preferences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own preferences"
  ON roommate_preferences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON roommate_preferences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  compatibility integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz,
  UNIQUE(user_id_1, user_id_2)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id IN (matches.user_id_1, matches.user_id_2)
    )
  );

CREATE POLICY "Users can insert matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id IN (matches.user_id_1, matches.user_id_2)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id IN (matches.user_id_1, matches.user_id_2)
    )
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages from their matches"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id IN (matches.user_id_1, matches.user_id_2)
      )
    )
  );

CREATE POLICY "Users can insert messages to their matches"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id IN (matches.user_id_1, matches.user_id_2)
      )
    )
  );

CREATE POLICY "Users can update messages they sent"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = messages.sender_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = messages.sender_id
    )
  );

-- Create swipe_actions table
CREATE TABLE IF NOT EXISTS swipe_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('like', 'pass')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, target_user_id)
);

ALTER TABLE swipe_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own swipe actions"
  ON swipe_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = swipe_actions.user_id
    )
  );

CREATE POLICY "Users can insert own swipe actions"
  ON swipe_actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = swipe_actions.user_id
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_roommate_preferences_user_id ON roommate_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_swipe_actions_user_id ON swipe_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_swipe_actions_target_user_id ON swipe_actions(target_user_id);
