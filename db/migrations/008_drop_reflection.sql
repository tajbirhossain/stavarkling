-- Step 1 reflection is no longer collected or shown.
ALTER TABLE access_applications
  DROP CONSTRAINT IF EXISTS access_applications_reflection_len;

ALTER TABLE access_applications
  DROP COLUMN IF EXISTS reflection;
