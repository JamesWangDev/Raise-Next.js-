/*
  Warnings:

  - You are about to drop the column `date` on the `pledges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interactions" ALTER COLUMN "inserted_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pledges" DROP COLUMN "date",
ALTER COLUMN "fufilled" SET DEFAULT false;
