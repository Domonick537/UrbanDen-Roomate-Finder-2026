/*
  # Link Checklists to Specific Matches

  ## Overview
  This migration enables tracking checklist progress separately for each match.
  Users can work through the same checklists (Safety, Pre-Meeting, etc.) with different 
  potential roommates and maintain independent progress for each relationship.

  ## Changes Made
  
  1. Schema Changes
    - Add `match_id` column to `user_checklist_progress` table
    - Create foreign key relationship to `matches` table
    - Allow null values (for backward compatibility with general checklists)
    
  2. Indexes
    - Add composite index on (user_id, match_id, item_id) for efficient queries
    - Ensures fast lookup of checklist progress for specific matches
    
  3. Security (RLS)
    - Update policies to ensure users can only access progress for their own matches
    - Users can only see progress where they're part of the match (user_id_1 or user_id_2)
    
  4. Data Integrity
    - Add constraint to ensure match_id references valid matches
    - Cascade delete when a match is removed (clean up checklist progress)
    
  ## Usage Notes
    - Existing progress items without match_id will continue to work (general checklists)
    - New match-specific items should include match_id
    - Each user can have separate progress for the same checklist template with different matches
*/

-- Add match_id column to user_checklist_progress
ALTER TABLE user_checklist_progress 
ADD COLUMN IF NOT EXISTS match_id uuid REFERENCES matches(id) ON DELETE CASCADE;

-- Create composite index for efficient match-specific queries
CREATE INDEX IF NOT EXISTS idx_user_checklist_progress_user_match_item 
ON user_checklist_progress(user_id, match_id, item_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own checklist progress" ON user_checklist_progress;
DROP POLICY IF EXISTS "Users can insert own checklist progress" ON user_checklist_progress;
DROP POLICY IF EXISTS "Users can update own checklist progress" ON user_checklist_progress;
DROP POLICY IF EXISTS "Users can delete own checklist progress" ON user_checklist_progress;

-- Create updated policies that consider match context
CREATE POLICY "Users can view own checklist progress"
  ON user_checklist_progress FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    -- Allow viewing if user is part of the match
    (match_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = user_checklist_progress.match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    ))
  );

CREATE POLICY "Users can insert own checklist progress"
  ON user_checklist_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    -- If match_id is provided, ensure user is part of that match
    (match_id IS NULL OR EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    ))
  );

CREATE POLICY "Users can update own checklist progress"
  ON user_checklist_progress FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    (match_id IS NULL OR EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    ))
  )
  WITH CHECK (
    user_id = auth.uid() AND
    (match_id IS NULL OR EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    ))
  );

CREATE POLICY "Users can delete own checklist progress"
  ON user_checklist_progress FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    (match_id IS NULL OR EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
    ))
  );
