ALTER TABLE tasks
ADD COLUMN end_date timestamptz;

UPDATE tasks
SET end_date = created_at + interval '1 hour'
WHERE created_at IS NOT NULL;