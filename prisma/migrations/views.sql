DROP VIEW IF EXISTS dashboard_by_account;

CREATE VIEW dashboard_by_account AS (
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

DROP VIEW IF EXISTS donations_for_user_display;

CREATE VIEW donations_for_user_display AS (
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

DROP VIEW IF EXISTS donations_rollup_by_person;

CREATE VIEW donations_rollup_by_person as (
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

DROP VIEW IF EXISTS people_for_user_display;

CREATE VIEW people_for_user_display AS (
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