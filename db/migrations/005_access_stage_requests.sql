-- Migration: track "request next stage" / acquisition CTA submissions

CREATE TABLE IF NOT EXISTS access_stage_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL
    REFERENCES access_applications (id) ON DELETE CASCADE,
  from_stage SMALLINT NOT NULL
    CONSTRAINT access_stage_requests_from_stage_range
      CHECK (from_stage BETWEEN 1 AND 3),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_ip INET,
  user_agent TEXT,
  CONSTRAINT access_stage_requests_app_stage_unique
    UNIQUE (application_id, from_stage)
);

CREATE INDEX IF NOT EXISTS access_stage_requests_application_idx
  ON access_stage_requests (application_id, requested_at DESC);

COMMENT ON TABLE access_stage_requests IS
  'Member CTA submissions requesting the next access stage (or private acquisition at stage 3). One request per application per stage.';

ALTER TABLE access_stage_requests ENABLE ROW LEVEL SECURITY;
