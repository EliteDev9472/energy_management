
-- Function to get a project's category ID safely
CREATE OR REPLACE FUNCTION get_project_category_id(project_id uuid)
RETURNS uuid[] 
LANGUAGE plpgsql
AS $$
DECLARE
  category_field_exists boolean;
  category_id uuid;
BEGIN
  -- Check if the category_id column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
    AND column_name = 'category_id'
  ) INTO category_field_exists;

  IF category_field_exists THEN
    -- If the column exists, try to get the category_id
    EXECUTE 'SELECT category_id FROM projects WHERE id = $1' 
    INTO category_id
    USING project_id;
    
    IF category_id IS NOT NULL THEN
      RETURN ARRAY[category_id];
    END IF;
  END IF;
  
  -- Return empty array if not found
  RETURN '{}';
END;
$$;

-- Function to check if a project belongs to a category
CREATE OR REPLACE FUNCTION check_project_belongs_to_category(p_project_id uuid, p_category_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  category_field_exists boolean;
  project_category_id uuid;
BEGIN
  -- Check if the category_id column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'projects'
    AND column_name = 'category_id'
  ) INTO category_field_exists;

  IF category_field_exists THEN
    -- If the column exists, try to get the category_id
    EXECUTE 'SELECT category_id FROM projects WHERE id = $1' 
    INTO project_category_id
    USING p_project_id;
    
    -- Compare with expected category
    RETURN project_category_id = p_category_id;
  END IF;
  
  -- If column doesn't exist, return false
  RETURN false;
END;
$$;
