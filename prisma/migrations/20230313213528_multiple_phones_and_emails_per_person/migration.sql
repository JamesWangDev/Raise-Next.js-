/*
  Warnings:

  - Made the column `organization_id` on table `call_sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `people` required. This step will fail if there are existing NULL values in that column.
  - Made the column `person_id` on table `pledges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `pledges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `pledges` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_id` on table `saved_lists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "call_sessions" ALTER COLUMN "organization_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "organization_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "people" ALTER COLUMN "organization_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "pledges" ALTER COLUMN "person_id" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "organization_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "saved_lists" ALTER COLUMN "organization_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "phone_numbers" ADD CONSTRAINT "phone_numbers_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
