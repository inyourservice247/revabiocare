CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE enquiries (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, email text NOT NULL, phone text NOT NULL, requirement text NOT NULL, is_read boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE TABLE push_subscriptions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), endpoint text NOT NULL UNIQUE, p256dh text NOT NULL, auth text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE rate_limit_buckets (scope text NOT NULL, subject_hash text NOT NULL, bucket_start timestamptz NOT NULL, attempts integer NOT NULL DEFAULT 0, PRIMARY KEY (scope, subject_hash, bucket_start));
