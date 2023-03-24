/*
  Warnings:

  - A unique constraint covering the columns `[call_sid]` on the table `call_session_participants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[call_session_id,number_dialed_in_from]` on the table `call_session_participants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "call_session_participants" ADD COLUMN     "call_sid" TEXT,
ADD COLUMN     "dialed_in" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "call_session_participants_call_sid_key" ON "call_session_participants"("call_sid");

-- CreateIndex
CREATE UNIQUE INDEX "call_session_participants_call_session_id_number_dialed_in__key" ON "call_session_participants"("call_session_id", "number_dialed_in_from");
