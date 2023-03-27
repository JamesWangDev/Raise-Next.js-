-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "call_session_id" BIGINT;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_call_session_id_fkey" FOREIGN KEY ("call_session_id") REFERENCES "call_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
