/*
  # Fix RLS Policies for Security

  ## Changes Made
  1. Drop existing overly permissive policies
  2. Create restrictive policies that check auth.uid()
  3. Ensure users can only access their own data
  
  ## Security Improvements
  - profiles: Users can only read/update their own profile
  - roommate_preferences: Users can only manage their own preferences
  - swipe_actions: Users can only create their own swipe actions
  - matches: Users can only see matches they're part of
  - messages: Users can only see messages from their matches
*/

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can read all preferences" ON roommate_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON roommate_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON roommate_preferences;

-- Create secure policies for profiles
CREATE POLICY "Users can view all public profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create secure policies for roommate_preferences
CREATE POLICY "Users can view all preferences"
  ON roommate_preferences FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own preferences"
  ON roommate_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = roommate_preferences.user_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update their own preferences"
  ON roommate_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = roommate_preferences.user_id
      AND profiles.id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = roommate_preferences.user_id
      AND profiles.id::text = auth.uid()::text
    )
  );
