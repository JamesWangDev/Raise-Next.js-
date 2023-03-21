-- AlterTable
ALTER TABLE "call_sessions" ADD COLUMN     "current_person_id" UUID;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_current_person_id_fkey" FOREIGN KEY ("current_person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
