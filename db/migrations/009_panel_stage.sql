-- Tracks which Access panel the member has entered (UI position).
-- access_stage = admin-granted ceiling; panel_stage = where they land / have entered.
-- Invariant: panel_stage <= access_stage.

ALTER TABLE access_applications
  ADD COLUMN IF NOT EXISTS panel_stage SMALLINT NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'access_applications_panel_stage_range'
  ) THEN
    ALTER TABLE access_applications
      ADD CONSTRAINT access_applications_panel_stage_range
      CHECK (panel_stage BETWEEN 1 AND 3);
  END IF;
END $$;

-- Existing members: treat their granted stage as already entered
-- so they are not forced back through ENTER / PROCEED.
UPDATE access_applications
SET panel_stage = access_stage
WHERE panel_stage IS DISTINCT FROM access_stage
  AND panel_stage = 1
  AND access_stage > 1;

-- Anyone somehow ahead of grant (should not happen) gets clamped.
UPDATE access_applications
SET panel_stage = access_stage
WHERE panel_stage > access_stage;

COMMENT ON COLUMN access_applications.panel_stage IS
  'Access panel the member has entered (1–3). Advances when they click ENTER/PROCEED. Must stay <= access_stage.';

-- Keep panel_stage <= access_stage when admin demotes.
CREATE OR REPLACE FUNCTION touch_access_stage_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.access_stage IS DISTINCT FROM OLD.access_stage THEN
    NEW.access_stage_updated_at := now();
    IF NEW.panel_stage > NEW.access_stage THEN
      NEW.panel_stage := NEW.access_stage;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
