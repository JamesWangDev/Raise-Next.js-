-- Fix the issue with JWT user being type checked for UUID and corresponding ghost RLS policy
ALTER TABLE
  storage.buckets DROP CONSTRAINT buckets_owner_fkey;

ALTER TABLE
  storage.buckets
ALTER COLUMN
  owner
SET
  DATA TYPE text;

ALTER TABLE
  storage.objects DROP CONSTRAINT objects_owner_fkey;

ALTER TABLE
  storage.objects
ALTER COLUMN
  owner
SET
  DATA TYPE text;

ALTER TABLE
  storage.objects DISABLE ROW LEVEL SECURITY;

INSERT INTO
  storage.buckets (id, name, created_at, updated_at, public)
VALUES
  ('imports', 'imports', now(), now(), TRUE) ON CONFLICT (id) DO NOTHING;

-- Create foreign data wrapper to fec
CREATE EXTENSION postgres_fdw;

GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO postgres;

CREATE SERVER fec FOREIGN DATA WRAPPER postgres_fdw OPTIONS (
  host 'db.lpuwtserzsvzipgptsxn.supabase.co',
  port '5432',
  dbname 'postgres'
);

CREATE USER MAPPING FOR postgres SERVER fec OPTIONS (
  user 'postgres',
  password '85349e2d-062f-4f0a-b7a1-e3f9a73e6240'
);

CREATE USER MAPPING FOR authenticated SERVER fec OPTIONS (
  user 'postgres',
  password '85349e2d-062f-4f0a-b7a1-e3f9a73e6240'
);

create foreign table alltime_individual_contributions (
  cmte_id varchar,
  amndt_ind varchar,
  rpt_tp varchar,
  transaction_pgi varchar,
  image_num int8,
  transaction_tp varchar,
  entity_tp varchar,
  name varchar,
  city varchar,
  state varchar,
  zip_code varchar,
  employer varchar,
  occupation varchar,
  transaction_dt date,
  transaction_amt numeric,
  other_id varchar,
  tran_id varchar,
  file_num int8,
  memo_cd varchar,
  memo_text varchar,
  sub_id int8 not null,
  concat_name varchar not null
) SERVER fec;