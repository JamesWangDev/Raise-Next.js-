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
    "id" UUID NOT NULL,
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
    "id" UUID NOT NULL,
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
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
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

