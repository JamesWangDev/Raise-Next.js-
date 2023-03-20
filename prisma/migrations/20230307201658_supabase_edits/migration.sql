-- This is an empty migration.

-- Fix the supabase /prisma issue
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- Add functions necessary for RLS
create or replace function requesting_user_id()
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

-- RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;ALTER TABLE donations FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS donations_org_id on donations;CREATE POLICY donations_org_id ON donations USING (organization_id = requesting_org_id());
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;ALTER TABLE call_sessions FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS call_sessions_org_id on call_sessions;CREATE POLICY call_sessions_org_id ON call_sessions USING (organization_id = requesting_org_id());
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;ALTER TABLE emails FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS emails_org_id on emails;CREATE POLICY emails_org_id ON emails USING (organization_id = requesting_org_id());
ALTER TABLE files ENABLE ROW LEVEL SECURITY;ALTER TABLE files FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS files_org_id on files;CREATE POLICY files_org_id ON files USING (organization_id = requesting_org_id());
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;ALTER TABLE import_batches FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS import_batches_org_id on import_batches;CREATE POLICY import_batches_org_id ON import_batches USING (organization_id = requesting_org_id());
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;ALTER TABLE interactions FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS interactions_org_id on interactions;CREATE POLICY interactions_org_id ON interactions USING (organization_id = requesting_org_id());
ALTER TABLE people ENABLE ROW LEVEL SECURITY;ALTER TABLE people FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS people_org_id on people;CREATE POLICY people_org_id ON people USING (organization_id = requesting_org_id());
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;ALTER TABLE phone_numbers FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS phone_numbers_org_id on phone_numbers;CREATE POLICY phone_numbers_org_id ON phone_numbers USING (organization_id = requesting_org_id());
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;ALTER TABLE pledges FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS pledges_org_id on pledges;CREATE POLICY pledges_org_id ON pledges USING (organization_id = requesting_org_id());
ALTER TABLE saved_lists ENABLE ROW LEVEL SECURITY;ALTER TABLE saved_lists FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS saved_lists_org_id on saved_lists;CREATE POLICY saved_lists_org_id ON saved_lists USING (organization_id = requesting_org_id());

-- Views necessary for application
CREATE OR REPLACE VIEW dashboard_by_account with (security_invoker = true) AS (
  select
    organization_id,
    CAST(grouped_donations.total_sum_donations as INTEGER),
    CAST(grouped_donations.number_of_donations as INTEGER),
    CAST(
      grouped_pledges.total_sum_unfufilled_pledges as INTEGER
    ),
    CAST(
      grouped_pledges.number_of_unfufilled_pledges as INTEGER
    )
  from
    (
      select
        sum(amount) as total_sum_donations,
        count(*) as number_of_donations,
        organization_id
      from
        donations
      group by
        organization_id
    ) grouped_donations full
    outer join (
      select
        sum(amount) as total_sum_unfufilled_pledges,
        count(*) as number_of_unfufilled_pledges,
        organization_id
      from
        pledges
        /*where fufilled!=true*/
      group by
        organization_id
    ) grouped_pledges using (organization_id)
);


CREATE OR REPLACE VIEW donations_for_user_display with (security_invoker = true) AS (
  select
    id,
    date,
    donor_first_name as first_name,
    donor_last_name as last_name,
    amount,
    organization_id
  from
    donations
);

CREATE OR REPLACE VIEW donations_rollup_by_person with (security_invoker = true) as (
  select
    person_id,
    sum(amount) as total_donated,
    count(*) as number_of_donations,
    max(date) as most_recent_donation,
    organization_id
  from
    donations
  group by
    person_id,
    organization_id
);

CREATE OR REPLACE VIEW people_for_user_display with (security_invoker = true) AS (
  select
    people.id,
    people.created_at,
    people.first_name,
    people.last_name,
    people.addr1,
    people.addr2,
    people.city,
    people.state,
    people.zip,
    people.country,
    people.occupation,
    people.employer,
    people.email,
    people.phone,
    total_donated,
    number_of_donations,
    most_recent_donation,
    indiv20b.*,
    people.organization_id
  from
    people
    left join donations_rollup_by_person on people.id = donations_rollup_by_person.person_id
    left join indiv20b on indiv20b.concatenated_zip_and_name = LOWER(
      CONCAT(
        COALESCE(
          CONCAT(people.first_name, '+', people.last_name),
          'NO_NAME_PROVIDED'
        ),
        '+',
        LPAD(
          LEFT(
            CAST(COALESCE(people.zip, '00000') AS VARCHAR),
            5
          ),
          5,
          '0'
        )
      )
    )
);