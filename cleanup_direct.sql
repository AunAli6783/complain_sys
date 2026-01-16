
USE complain_sys;
ALTER TABLE complaints DROP COLUMN IF EXISTS resolved_by_admin_id;
SHOW COLUMNS FROM complaints;