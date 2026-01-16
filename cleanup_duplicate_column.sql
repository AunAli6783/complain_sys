
-- Remove duplicate resolved_by_admin_id column (use resolved_by instead)
ALTER TABLE complaints 
DROP COLUMN IF EXISTS resolved_by_admin_id;