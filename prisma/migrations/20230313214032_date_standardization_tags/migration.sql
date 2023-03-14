/*
 Warnings:
 
 - You are about to drop the column `email` on the `people` table. All the data in the column will be lost.
 - You are about to drop the column `phone` on the `people` table. All the data in the column will be lost.
 - You are about to drop the column `tags` on the `people` table. All the data in the column will be lost.
 - Made the column `first_name` on table `people` required. This step will fail if there are existing NULL values in that column.
 - Made the column `last_name` on table `people` required. This step will fail if there are existing NULL values in that column.
 - Made the column `created_at` on table `phone_numbers` required. This step will fail if there are existing NULL values in that column.
 
 */
-- AlterTable
DROP VIEW people_for_user_display;

CREATE
OR REPLACE VIEW people_for_user_display with (security_invoker = true) AS (
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
    -- people.email,
    -- people.phone,
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

ALTER TABLE
  "people" DROP COLUMN "email",
  DROP COLUMN "phone",
  DROP COLUMN "tags",
ALTER COLUMN
  "created_at"
SET
  DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "inserted_at"
SET
  DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "updated_at"
SET
  DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "first_name"
SET
  NOT NULL,
ALTER COLUMN
  "last_name"
SET
  NOT NULL;

-- AlterTable
ALTER TABLE
  "phone_numbers"
ADD
  COLUMN "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD
  COLUMN "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "created_at"
SET
  NOT NULL;

-- AlterTable
ALTER TABLE
  "pledges"
ALTER COLUMN
  "created_at"
SET
  DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "inserted_at"
SET
  DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN
  "updated_at"
SET
  DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "tags" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "tag" TEXT NOT NULL,
  "person_id" UUID NOT NULL,
  "organization_id" TEXT NOT NULL DEFAULT requesting_org_id(),
  "batch_id" UUID,
  CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
  "tags"
ADD
  CONSTRAINT "tags_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;