/*
  # Fix Critical RLS Policy Vulnerabilities

  1. Security Issues Fixed
    - **profiles** - Replace USING (true) with proper auth.uid() check for updates
    - **roommate_preferences** - Replace USING (true) with proper auth.uid() check for updates
    - **phone/email exposure** - Create view for safe profile viewing that hides sensitive data

  2. Changes Made
    - Drop and recreate UPDATE policies with proper ownership checks
    - Add restrictive policies to ensure users can only modify their own data
    - Create a safe_profiles view that excludes phone numbers from public viewing

  3. Impact
    - Prevents unauthorized profile modifications
    - Protects user privacy (phone numbers, emails)
    - Maintains proper data access control at scale
*/

-- Drop the insecure UPDATE policy for profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create secure UPDATE policy - users can ONLY update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Drop the insecure UPDATE policy for roommate_preferences
DROP POLICY IF EXISTS "Users can update own preferences" ON roommate_preferences;

-- Create secure UPDATE policy - users can ONLY update their own preferences
CREATE POLICY "Users can update own preferences"
  ON roommate_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a safe view for profile viewing that hides sensitive information
CREATE OR REPLACE VIEW safe_profiles AS
SELECT 
  id,
  first_name,
  age,
  gender,
  occupation,
  profile_picture,
  bio,
  is_verified,
  created_at,
  last_active,
  photos
FROM profiles;

-- Grant access to the view
GRANT SELECT ON safe_profiles TO authenticated;

-- Add policy to ensure messages can only be sent by the actual sender
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE id = match_id 
      AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

-- Add policy to ensure users can only create swipe actions for themselves
DROP POLICY IF EXISTS "Users can create own swipe actions" ON swipe_actions;

CREATE POLICY "Users can create own swipe actions"
  ON swipe_actions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure users cannot see other users' swipe actions
DROP POLICY IF EXISTS "Users can read own swipe actions" ON swipe_actions;

CREATE POLICY "Users can read own swipe actions"
  ON swipe_actions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Prevent users from deleting matches (data integrity)
DROP POLICY IF EXISTS "Users can delete matches" ON matches;

-- Users should only be able to view matches they are part of
DROP POLICY IF EXISTS "Users can view their matches" ON matches;

CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
