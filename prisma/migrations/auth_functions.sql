create or replace function requesting_org_id()
returns text
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;
create or replace function requesting_org_id()
returns text
language sql stable
as $$
  select nullif((current_setting('request.jwt.claims', true)::json->>'user_metadata')::json->>'orgID', '')::text;
$$;