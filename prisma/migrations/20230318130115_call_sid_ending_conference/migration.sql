/*
  Warnings:

  - Added the required column `call_sid_ending_conference` to the `conference_updates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conference_updates" ADD COLUMN     "call_sid_ending_conference" TEXT NOT NULL;
