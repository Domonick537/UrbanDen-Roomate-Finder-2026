/*
  # Add Age Range Filtering to Roommate Preferences

  ## Changes Made
  
  1. Add New Columns to roommate_preferences table
    - `age_min` (integer) - Minimum age preference for potential roommates
    - `age_max` (integer) - Maximum age preference for potential roommates
    
  2. Default Values
    - `age_min` defaults to 18 (legal adult age)
    - `age_max` defaults to 65 (reasonable upper bound)
    
  ## Purpose
  
  This migration enables users to filter potential roommate matches by age range,
  similar to popular dating apps. Users can now specify:
  - Minimum age they're comfortable with (e.g., 25)
  - Maximum age they're comfortable with (e.g., 35)
  
  Combined with the existing gender_preference field, this provides comprehensive
  filtering options for finding compatible roommates.
*/

-- Add age_min and age_max columns to roommate_preferences table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roommate_preferences' AND column_name = 'age_min'
  ) THEN
    ALTER TABLE roommate_preferences ADD COLUMN age_min integer NOT NULL DEFAULT 18;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roommate_preferences' AND column_name = 'age_max'
  ) THEN
    ALTER TABLE roommate_preferences ADD COLUMN age_max integer NOT NULL DEFAULT 65;
  END IF;
END $$;

-- Add check constraint to ensure age_min is less than or equal to age_max
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'roommate_preferences_age_range_check'
  ) THEN
    ALTER TABLE roommate_preferences 
    ADD CONSTRAINT roommate_preferences_age_range_check 
    CHECK (age_min <= age_max AND age_min >= 18 AND age_max <= 100);
  END IF;
END $$;