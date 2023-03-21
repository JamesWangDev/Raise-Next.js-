/*
  Warnings:

  - You are about to drop the `conference_participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "conference_participants";

-- CreateTable
CREATE TABLE "call_session_participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number_dialed_in_from" BIGINT NOT NULL,
    "organization_id" TEXT NOT NULL DEFAULT requesting_org_id(),
    "user_id" TEXT NOT NULL DEFAULT requesting_user_id(),
    "call_session_id" BIGINT,

    CONSTRAINT "conference_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "call_session_participants" ADD CONSTRAINT "call_session_participants_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
