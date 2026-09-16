-- Migration: access section email + OTP auth tables

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
