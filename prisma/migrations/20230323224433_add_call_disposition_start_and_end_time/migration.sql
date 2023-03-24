-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "call_sid" TEXT,
ADD COLUMN     "ended_at" TIMESTAMPTZ(6);
