-- Access application schema for Stavarkling request-access flow.
-- Run in Supabase SQL Editor (or via migration tooling).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'access_application_status'
  ) THEN
    CREATE TYPE access_application_status AS ENUM (
      'pending',
      'under_review',
      'approved',
      'rejected',
      'withdrawn'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS access_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Step 2 — required identity
  full_name TEXT NOT NULL
    CONSTRAINT access_applications_full_name_len
      CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL
    CONSTRAINT access_applications_email_format
      CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  email_normalized TEXT GENERATED ALWAYS AS (lower(btrim(email))) STORED,
  country TEXT NOT NULL
    CONSTRAINT access_applications_country_len
      CHECK (char_length(btrim(country)) BETWEEN 2 AND 80),

  -- Step 2 — required motivation
  reason TEXT NOT NULL
    CONSTRAINT access_applications_reason_len
      CHECK (char_length(btrim(reason)) BETWEEN 10 AND 4000),

  -- Step 1 — optional reflection (private prompts are not stored)
  reflection TEXT
    CONSTRAINT access_applications_reflection_len
      CHECK (
        reflection IS NULL
        OR char_length(btrim(reflection)) BETWEEN 1 AND 4000
      ),

  -- Client-generated key so retries of the same submit do not create duplicates
  idempotency_key UUID NOT NULL,

  status access_application_status NOT NULL DEFAULT 'pending',

  -- Access journey stage (THE BEGINNING / THE MOMENT / THE DECISION).
  -- New applications start at stage 1.
  access_stage SMALLINT NOT NULL DEFAULT 1
    CONSTRAINT access_applications_access_stage_range
      CHECK (access_stage BETWEEN 1 AND 3),
  access_stage_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Optional request metadata (filled by API later)
  client_ip INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT access_applications_idempotency_key_unique UNIQUE (idempotency_key)
);

COMMENT ON TABLE access_applications IS
  'Private acquisition / request-access submissions from the 3-step application flow.';

COMMENT ON COLUMN access_applications.reflection IS
  'Optional free-text from step 1. Guided reflection prompts are not recorded.';

COMMENT ON COLUMN access_applications.idempotency_key IS
  'UUID generated once per draft submission attempt; identical retries return the same row.';

COMMENT ON COLUMN access_applications.access_stage IS
  'Current access journey stage: 1=Beginning, 2=Moment, 3=Decision. New applications start at 1.';

COMMENT ON COLUMN access_applications.access_stage_updated_at IS
  'When access_stage last changed.';

-- One active application per email (blocks duplicate pending/in-review orders)
CREATE UNIQUE INDEX IF NOT EXISTS access_applications_email_active_uidx
  ON access_applications (email_normalized)
  WHERE status IN ('pending', 'under_review');

CREATE INDEX IF NOT EXISTS access_applications_status_created_idx
  ON access_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS access_applications_email_normalized_idx
  ON access_applications (email_normalized);

CREATE INDEX IF NOT EXISTS access_applications_access_stage_idx
  ON access_applications (access_stage);

CREATE OR REPLACE FUNCTION set_access_applications_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS access_applications_set_updated_at ON access_applications;
CREATE TRIGGER access_applications_set_updated_at
  BEFORE UPDATE ON access_applications
  FOR EACH ROW
  EXECUTE FUNCTION set_access_applications_updated_at();

-- Stamp access_stage_updated_at whenever the journey stage advances.
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

ALTER TABLE access_applications ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Access section auth (email + OTP via Resend)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS access_otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized TEXT NOT NULL,
  application_id UUID NOT NULL
    REFERENCES access_applications (id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempt_count SMALLINT NOT NULL DEFAULT 0
    CONSTRAINT access_otp_challenges_attempt_count_range
      CHECK (attempt_count >= 0 AND attempt_count <= 10),
  request_ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS access_otp_challenges_email_created_idx
  ON access_otp_challenges (email_normalized, created_at DESC);

CREATE INDEX IF NOT EXISTS access_otp_challenges_active_idx
  ON access_otp_challenges (email_normalized, expires_at)
  WHERE consumed_at IS NULL;

CREATE TABLE IF NOT EXISTS access_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized TEXT NOT NULL,
  application_id UUID NOT NULL
    REFERENCES access_applications (id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT access_sessions_token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS access_sessions_email_idx
  ON access_sessions (email_normalized);

CREATE INDEX IF NOT EXISTS access_sessions_application_idx
  ON access_sessions (application_id);

COMMENT ON TABLE access_otp_challenges IS
  'One-time codes for access-section email verification. Codes are stored hashed.';

COMMENT ON TABLE access_sessions IS
  'Authenticated access-section sessions after OTP verification. Tokens are stored hashed.';

ALTER TABLE access_otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_sessions ENABLE ROW LEVEL SECURITY;

-- Server uses DATABASE_URL (bypasses RLS). No anon/authenticated policies
-- means PostgREST/client access is denied by default.
