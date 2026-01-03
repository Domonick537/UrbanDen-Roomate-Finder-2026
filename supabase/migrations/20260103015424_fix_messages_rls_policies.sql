/*
  # Fix Messages RLS Policies

  ## Changes
  - Drop existing messages RLS policies
  - Create new correct policies that verify the authenticated user is a participant in the match
  
  ## Security
  - Users can only read messages from matches they are part of
  - Users can only send messages to matches they are part of
  - Users can only update their own messages
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read messages from their matches" ON messages;
DROP POLICY IF EXISTS "Users can insert messages to their matches" ON messages;
DROP POLICY IF EXISTS "Users can update messages they sent" ON messages;

-- Create correct policies
CREATE POLICY "Users can read messages from their matches"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages to their matches"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());