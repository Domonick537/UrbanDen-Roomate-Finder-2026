-- Checklist System
-- 
-- 1. New Tables
--    - checklist_templates: Template checklists (move-in, safety, compatibility)
--    - checklist_items: Individual items within each template
--    - user_checklist_progress: Tracks user's progress on checklist items
--
-- 2. Security
--    - Enable RLS on all tables
--    - Users can read all checklist templates and items (public)
--    - Users can only manage their own progress

-- Create checklist_templates table
CREATE TABLE IF NOT EXISTS checklist_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('move-in', 'safety', 'compatibility', 'pre-meeting')),
  icon text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  input_type text NOT NULL CHECK (input_type IN ('checkbox', 'dropdown', 'text', 'date')),
  dropdown_options jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_checklist_progress table
CREATE TABLE IF NOT EXISTS user_checklist_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  selected_value text,
  notes text,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for checklist_templates (public read)
CREATE POLICY "Anyone can view checklist templates"
  ON checklist_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for checklist_items (public read)
CREATE POLICY "Anyone can view checklist items"
  ON checklist_items
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_checklist_progress
CREATE POLICY "Users can view own progress"
  ON user_checklist_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_checklist_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_checklist_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_checklist_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default checklist templates
INSERT INTO checklist_templates (title, description, category, icon, order_index) VALUES
  ('Safety First Checklist', 'Essential safety steps before meeting a potential roommate in person', 'safety', 'shield', 1),
  ('Pre-Meeting Checklist', 'Things to verify and prepare before your first meeting', 'pre-meeting', 'users', 2),
  ('Compatibility Check', 'Key questions to discuss with potential roommates', 'compatibility', 'heart', 3),
  ('Move-In Checklist', 'Essential tasks when moving in with your new roommate', 'move-in', 'home', 4);

-- Get the template IDs for inserting items
DO $$
DECLARE
  safety_id uuid;
  pre_meeting_id uuid;
  compatibility_id uuid;
  move_in_id uuid;
BEGIN
  SELECT id INTO safety_id FROM checklist_templates WHERE category = 'safety';
  SELECT id INTO pre_meeting_id FROM checklist_templates WHERE category = 'pre-meeting';
  SELECT id INTO compatibility_id FROM checklist_templates WHERE category = 'compatibility';
  SELECT id INTO move_in_id FROM checklist_templates WHERE category = 'move-in';

  -- Safety First Checklist Items
  INSERT INTO checklist_items (template_id, title, description, order_index, input_type) VALUES
    (safety_id, 'Profile is verified', 'Check that the person has a verified badge on their profile', 1, 'checkbox'),
    (safety_id, 'Shared location with friend/family', 'Tell someone you trust where you are going and when', 2, 'checkbox'),
    (safety_id, 'Meeting in public place', 'Choose a busy, public location like a coffee shop or mall', 3, 'checkbox'),
    (safety_id, 'Daytime meeting scheduled', 'Schedule your first meeting during daylight hours', 4, 'checkbox'),
    (safety_id, 'Keep phone charged', 'Ensure your phone is fully charged before meeting', 5, 'checkbox');

  -- Pre-Meeting Checklist Items
  INSERT INTO checklist_items (template_id, title, description, order_index, input_type, dropdown_options) VALUES
    (pre_meeting_id, 'Reviewed their full profile', 'Read through their bio, preferences, and photos', 1, 'checkbox', NULL),
    (pre_meeting_id, 'Verified on social media', 'Check their identity through LinkedIn, Facebook, or Instagram', 2, 'checkbox', NULL),
    (pre_meeting_id, 'Prepared questions to ask', 'Have a list of important questions ready', 3, 'checkbox', NULL),
    (pre_meeting_id, 'Communication method preference', 'How do you prefer to communicate after matching?', 4, 'dropdown', '["In-app messaging only", "Phone calls OK", "Text messages OK", "Video calls OK"]'),
    (pre_meeting_id, 'Meeting location chosen', 'Where will you meet?', 5, 'text', NULL);

  -- Compatibility Check Items
  INSERT INTO checklist_items (template_id, title, description, order_index, input_type, dropdown_options) VALUES
    (compatibility_id, 'Budget alignment', 'Discussed and agreed on rent budget and split', 1, 'checkbox', NULL),
    (compatibility_id, 'Move-in timeline', 'Confirmed compatible move-in dates', 2, 'checkbox', NULL),
    (compatibility_id, 'Lifestyle compatibility', 'What is your compatibility level?', 3, 'dropdown', '["Excellent match", "Good match", "Some concerns", "Not compatible"]'),
    (compatibility_id, 'Cleaning expectations', 'Discussed cleaning schedule and standards', 4, 'checkbox', NULL),
    (compatibility_id, 'Noise levels', 'Agreed on quiet hours and noise preferences', 5, 'checkbox', NULL),
    (compatibility_id, 'Guest policy', 'Discussed rules for having guests over', 6, 'checkbox', NULL),
    (compatibility_id, 'Pet situation', 'Confirmed pet ownership and allergies', 7, 'checkbox', NULL),
    (compatibility_id, 'Work schedule', 'Shared work schedules and discussed conflicts', 8, 'checkbox', NULL);

  -- Move-In Checklist Items
  INSERT INTO checklist_items (template_id, title, description, order_index, input_type, dropdown_options) VALUES
    (move_in_id, 'Lease review', 'Both reviewed and signed the lease agreement', 1, 'checkbox', NULL),
    (move_in_id, 'Security deposit paid', 'Confirmed who pays what portion of deposit', 2, 'checkbox', NULL),
    (move_in_id, 'Utilities setup', 'What utilities need to be set up?', 3, 'dropdown', '["Internet", "Electricity", "Gas", "Water", "All handled by landlord"]'),
    (move_in_id, 'Keys/access cards received', 'Both roommates have keys and building access', 4, 'checkbox', NULL),
    (move_in_id, 'Roommate agreement signed', 'Created and signed a roommate agreement', 5, 'checkbox', NULL),
    (move_in_id, 'Common area furniture', 'Discussed who brings what furniture', 6, 'checkbox', NULL),
    (move_in_id, 'Kitchen supplies split', 'Agreed on shared vs personal kitchen items', 7, 'checkbox', NULL),
    (move_in_id, 'Bathroom organization', 'Organized storage space in bathroom', 8, 'checkbox', NULL),
    (move_in_id, 'Emergency contacts exchanged', 'Shared emergency contact information', 9, 'checkbox', NULL),
    (move_in_id, 'Move-in date confirmed', 'When are you moving in?', 10, 'date', NULL);
END $$;