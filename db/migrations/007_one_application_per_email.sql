-- One pending, under-review OR approved application per email.
-- The previous unique index only covered pending/under_review, so an approved
-- (or otherwise closed) email could submit a second application.
--
-- Run in the Supabase SQL Editor. Review the SELECT first: any email that has
-- an approved application AND a newer open one will have the newer one set to
-- 'withdrawn' so the new index can be created. Nothing is deleted.

-- 1. See what will be touched (read-only)
-- SELECT a.id, a.full_name, a.email, a.status, a.created_at
-- FROM access_applications a
-- JOIN access_applications b
--   ON b.email_normalized = a.email_normalized AND b.id <> a.id
-- WHERE a.status IN ('pending', 'under_review') AND b.status = 'approved';

-- 2. Close stray open applications that sit beside an approved one
UPDATE access_applications a
SET status = 'withdrawn'
FROM access_applications b
WHERE b.email_normalized = a.email_normalized
  AND b.id <> a.id
  AND b.status = 'approved'
  AND a.status IN ('pending', 'under_review');

-- 3. Enforce the rule in the database
DROP INDEX IF EXISTS access_applications_email_active_uidx;

CREATE UNIQUE INDEX access_applications_email_active_uidx
  ON access_applications (email_normalized)
  WHERE status IN ('pending', 'under_review', 'approved');
