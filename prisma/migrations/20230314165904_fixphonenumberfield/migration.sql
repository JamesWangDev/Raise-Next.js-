/*
  Warnings:

  - You are about to drop the column `phone` on the `phone_numbers` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `phone_numbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phone_numbers" DROP COLUMN "phone",
ADD COLUMN     "phone_number" INTEGER NOT NULL;
