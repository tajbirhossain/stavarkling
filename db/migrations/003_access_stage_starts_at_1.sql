-- Migration: applications start at access stage 1 (not 0)
-- Run after 002_access_stage.sql if that was already applied.

-- Move any existing 0 → 1 before tightening the check constraint
UPDATE access_applications
SET
  access_stage = 1,
  access_stage_updated_at = COALESCE(access_stage_updated_at, now())
WHERE access_stage = 0;

ALTER TABLE access_applications
  ALTER COLUMN access_stage SET DEFAULT 1;

ALTER TABLE access_applications
  ALTER COLUMN access_stage_updated_at SET DEFAULT now();

UPDATE access_applications
SET access_stage_updated_at = now()
WHERE access_stage_updated_at IS NULL;

ALTER TABLE access_applications
  ALTER COLUMN access_stage_updated_at SET NOT NULL;

ALTER TABLE access_applications
  DROP CONSTRAINT IF EXISTS access_applications_access_stage_range;

ALTER TABLE access_applications
  ADD CONSTRAINT access_applications_access_stage_range
  CHECK (access_stage BETWEEN 1 AND 3);

COMMENT ON COLUMN access_applications.access_stage IS
  'Current access journey stage: 1=Beginning, 2=Moment, 3=Decision. New applications start at 1.';

COMMENT ON COLUMN access_applications.access_stage_updated_at IS
  'When access_stage last changed.';

DROP INDEX IF EXISTS access_applications_access_stage_idx;
CREATE INDEX access_applications_access_stage_idx
  ON access_applications (access_stage);

DROP TRIGGER IF EXISTS access_applications_sync_access_stage ON access_applications;
DROP FUNCTION IF EXISTS sync_access_stage_on_approval();

CREATE OR REPLACE FUNCTION touch_access_stage_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.access_stage IS DISTINCT FROM OLD.access_stage THEN
    NEW.access_stage_updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS access_applications_touch_access_stage ON access_applications;
CREATE TRIGGER access_applications_touch_access_stage
  BEFORE UPDATE OF access_stage ON access_applications
  FOR EACH ROW
  EXECUTE FUNCTION touch_access_stage_updated_at();
