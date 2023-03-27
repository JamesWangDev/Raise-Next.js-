-- search function/rpc for instantsearch
CREATE EXTENSION pg_trgm;
create or replace function search(query text)
returns setof people
language sql
as $$
  select * from people where organization_id = requesting_org_id()
  order by lower(query) <-> lower(first_name||' '||last_name) limit 100;
$$;