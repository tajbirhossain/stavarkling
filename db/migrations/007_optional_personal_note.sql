-- Personal note (reason) is optional. Blank submissions are stored as NULL.
-- Existing notes stay as-is (they already satisfy the 10–4000 length check).

ALTER TABLE access_applications
  DROP CONSTRAINT IF EXISTS access_applications_reason_len;

ALTER TABLE access_applications
  ALTER COLUMN reason DROP NOT NULL;

ALTER TABLE access_applications
  ADD CONSTRAINT access_applications_reason_len
  CHECK (
    reason IS NULL
    OR char_length(btrim(reason)) BETWEEN 10 AND 4000
  );

COMMENT ON COLUMN access_applications.reason IS
  'Optional personal note from step 2. Blank submissions are stored as NULL.';
