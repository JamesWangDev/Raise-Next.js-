-- Fix the issue with JWT user being type checked for UUID and corresponding ghost RLS policy
ALTER TABLE storage.buckets DROP CONSTRAINT buckets_owner_fkey;
ALTER TABLE storage.buckets ALTER COLUMN owner SET DATA TYPE text;
ALTER TABLE storage.objects DROP CONSTRAINT objects_owner_fkey;
ALTER TABLE storage.objects ALTER COLUMN owner SET DATA TYPE text;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
INSERT INTO storage.buckets (id,name,created_at,updated_at,public,avif_autodetection) VALUES ('imports','imports',now(),now(),TRUE,FALSE)
ON CONFLICT (id) DO NOTHING;