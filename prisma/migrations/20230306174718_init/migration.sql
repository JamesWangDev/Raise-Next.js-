-- Fix the supabase /prisma issue
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "call_sessions" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "list_id" UUID,
    "started" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_call" TIMESTAMPTZ(6),
    "organization_id" TEXT,

    CONSTRAINT "call_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "person_id" UUID,
    "batch_id" UUID,
    "created_at" TIMESTAMPTZ(6),
    "inserted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "receipt_id" TEXT,
    "date" TEXT,
    "amount" DECIMAL,
    "recurring_total_months" TEXT,
    "recurrence_number" TEXT,
    "recipient" TEXT,
    "fundraising_page" TEXT,
    "fundraising_partner" TEXT,
    "reference_code_2" TEXT,
    "reference_code" TEXT,
    "donor_first_name" TEXT,
    "donor_last_name" TEXT,
    "donor_addr1" TEXT,
    "donor_addr2" TEXT,
    "donor_city" TEXT,
    "donor_state" TEXT,
    "donor_zip" TEXT,
    "donor_country" TEXT,
    "donor_occupation" TEXT,
    "donor_employer" TEXT,
    "donor_email" TEXT,
    "donor_phone" TEXT,
    "new_express_signup" TEXT,
    "comments" TEXT,
    "check_number" TEXT,
    "check_date" TEXT,
    "employer_addr1" TEXT,
    "employer_addr2" TEXT,
    "employer_city" TEXT,
    "employer_state" TEXT,
    "employer_zip" TEXT,
    "employer_country" TEXT,
    "donor_id" TEXT,
    "fundraiser_id" TEXT,
    "fundraiser_recipient_id" TEXT,
    "fundraiser_contact_email" TEXT,
    "fundraiser_contact_first_name" TEXT,
    "fundraiser_contact_last_name" TEXT,
    "partner_id" TEXT,
    "partner_contact_email" TEXT,
    "partner_contact_first_name" TEXT,
    "partner_contact_last_name" TEXT,
    "reserved1" TEXT,
    "lineitem_id" TEXT,
    "ab_test_name" TEXT,
    "ab_variation" TEXT,
    "recipient_committee" TEXT,
    "recipient_id" TEXT,
    "recipient_gov_id" TEXT,
    "recipient_election" TEXT,
    "reserved2" TEXT,
    "payment_id" TEXT,
    "payment_date" TEXT,
    "disbursement_id" TEXT,
    "disbursement_date" TEXT,
    "recovery_id" TEXT,
    "recovery_date" TEXT,
    "refund_id" TEXT,
    "refund_date" TEXT,
    "fee" TEXT,
    "recur_weekly" TEXT,
    "actblue_express_lane" TEXT,
    "reserved3" TEXT,
    "card_type" TEXT,
    "reserved4" TEXT,
    "reserved5" TEXT,
    "reserved6" TEXT,
    "reserved7" TEXT,
    "mobile" TEXT,
    "recurring_upsell_shown" TEXT,
    "recurring_upsell_succeeded" TEXT,
    "double_down" TEXT,
    "smart_recurring" TEXT,
    "monthly_recurring_amount" TEXT,
    "apple_pay" TEXT,
    "card_replaced_by_account_updater" TEXT,
    "actblue_express_donor" TEXT,
    "custom_field_1_label" TEXT,
    "custom_field_1_value" TEXT,
    "donor_us_passport_number" TEXT,
    "text_message_opt_in" TEXT,
    "gift_identifier" TEXT,
    "gift_declined" TEXT,
    "shipping_addr1" TEXT,
    "shipping_city" TEXT,
    "shipping_state" TEXT,
    "shipping_zip" TEXT,
    "shipping_country" TEXT,
    "weekly_recurring_amount" TEXT,
    "smart_boost_amount" TEXT,
    "smart_boost_shown" TEXT,
    "organization_id" TEXT,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "person_id" UUID NOT NULL,
    "organization_id" TEXT NOT NULL,
    "batch_id" UUID,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "filename" TEXT,
    "organization_id" TEXT,
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batches" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized" TIMESTAMPTZ(6),
    "success" BOOLEAN,
    "records_affected" INTEGER,
    "file_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indiv20b" (
    "concatenated_zip_and_name" TEXT NOT NULL,
    "donations_made_in_2020" BIGINT,
    "total_donated_2020" BIGINT,
    "list_of_committees_2020" TEXT,
    "number_of_committees_2020" BIGINT,

    CONSTRAINT "indiv20b_pkey" PRIMARY KEY ("concatenated_zip_and_name")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "inserted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "batch_id" UUID,
    "person_id" UUID,
    "contact_type" TEXT,
    "disposition" TEXT,
    "disposition_more" TEXT,
    "resulted_in_pledge" BOOLEAN DEFAULT false,
    "pledge_id" UUID,
    "note" TEXT,
    "organization_id" TEXT,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "batch_id" UUID,
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "organization_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "addr1" TEXT,
    "addr2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "occupation" TEXT,
    "employer" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "tags" TEXT[],
    "custom_field_1" TEXT,
    "custom_field_2" TEXT,
    "custom_field_3" TEXT,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_numbers" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "phone" INTEGER NOT NULL,
    "person_id" UUID NOT NULL,
    "organization_id" TEXT NOT NULL,
    "batch_id" UUID,

    CONSTRAINT "phone_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pledges" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "person_id" UUID,
    "batch_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "date" TEXT,
    "amount" DECIMAL,
    "fufilled" BOOLEAN,
    "organization_id" TEXT,

    CONSTRAINT "pledges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_lists" (
    "name" TEXT NOT NULL,
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "organization_id" TEXT,

    CONSTRAINT "saved_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indiv20b_concatenated_zip_and_name_key" ON "indiv20b"("concatenated_zip_and_name");

-- CreateIndex
CREATE UNIQUE INDEX "saved_lists_id_key" ON "saved_lists"("id");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Add functions necessary for RLS
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

-- Fix the issue with JWT user being type checked for UUID and corresponding ghost RLS policy
ALTER TABLE storage.buckets DROP CONSTRAINT buckets_owner_fkey;
ALTER TABLE storage.buckets ALTER COLUMN owner SET DATA TYPE text;
ALTER TABLE storage.objects DROP CONSTRAINT objects_owner_fkey;
ALTER TABLE storage.objects ALTER COLUMN owner SET DATA TYPE text;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
INSERT INTO storage.buckets (id,name,created_at,updated_at,public,avif_autodetection) VALUES ('imports','imports',now(),now(),TRUE,FALSE)
ON CONFLICT (id) DO NOTHING;