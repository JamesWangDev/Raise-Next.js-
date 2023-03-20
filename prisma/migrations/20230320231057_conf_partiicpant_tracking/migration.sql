/*
  Warnings:

  - A unique constraint covering the columns `[twilio_conference_sid]` on the table `call_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "call_sessions" ADD COLUMN     "twilio_conference_sid" TEXT;

-- CreateTable
CREATE TABLE "conference_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number_dialed_in_from" BIGINT NOT NULL,
    "organization_id" TEXT NOT NULL DEFAULT requesting_org_id(),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "conference_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "call_sessions_twilio_conference_sid_key" ON "call_sessions"("twilio_conference_sid");
