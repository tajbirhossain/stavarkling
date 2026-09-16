-- Migration: add access journey stage tracking
-- Safe to run if access_applications already exists.
-- NOTE: Prefer 003 afterward so default stage is 1 (this file kept for history).

ALTER TABLE access_applications
  ADD COLUMN IF NOT EXISTS access_stage SMALLINT NOT NULL DEFAULT 1;

ALTER TABLE access_applications
  ADD COLUMN IF NOT EXISTS access_stage_updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'access_applications_access_stage_range'
  ) THEN
    ALTER TABLE access_applications
      ADD CONSTRAINT access_applications_access_stage_range
      CHECK (access_stage BETWEEN 1 AND 3);
  END IF;
END $$;

COMMENT ON COLUMN access_applications.access_stage IS
  'Current access journey stage: 1=Beginning, 2=Moment, 3=Decision. New applications start at 1.';

COMMENT ON COLUMN access_applications.access_stage_updated_at IS
  'When access_stage last changed.';

CREATE INDEX IF NOT EXISTS access_applications_access_stage_idx
  ON access_applications (access_stage);

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

DROP TRIGGER IF EXISTS access_applications_sync_access_stage ON access_applications;
DROP TRIGGER IF EXISTS access_applications_touch_access_stage ON access_applications;
CREATE TRIGGER access_applications_touch_access_stage
  BEFORE UPDATE OF access_stage ON access_applications
  FOR EACH ROW
  EXECUTE FUNCTION touch_access_stage_updated_at();
