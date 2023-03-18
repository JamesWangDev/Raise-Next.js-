-- AlterTable
ALTER TABLE "conference_updates" ADD COLUMN     "participant_label" TEXT,
ALTER COLUMN "call_sid" DROP NOT NULL;
