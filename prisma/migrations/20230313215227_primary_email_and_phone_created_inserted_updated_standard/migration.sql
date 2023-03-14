/*
  Warnings:

  - A unique constraint covering the columns `[primary_for]` on the table `emails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[primary_for]` on the table `phone_numbers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `primary_for` to the `emails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primary_for` to the `phone_numbers` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `saved_lists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "call_sessions" ADD COLUMN     "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "primary_for" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "import_batches" ADD COLUMN     "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "phone_numbers" ADD COLUMN     "primary_for" UUID NOT NULL;

-- AlterTable
ALTER TABLE "saved_lists" ADD COLUMN     "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "emails_primary_for_key" ON "emails"("primary_for");

-- CreateIndex
CREATE UNIQUE INDEX "phone_numbers_primary_for_key" ON "phone_numbers"("primary_for");
