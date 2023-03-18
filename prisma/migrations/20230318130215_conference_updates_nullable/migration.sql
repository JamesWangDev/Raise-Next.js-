-- AlterTable
ALTER TABLE "conference_updates" ALTER COLUMN "coaching" DROP NOT NULL,
ALTER COLUMN "friendly_name" DROP NOT NULL,
ALTER COLUMN "sequence_number" DROP NOT NULL,
ALTER COLUMN "end_conference_on_exit" DROP NOT NULL,
ALTER COLUMN "status_callback_event" DROP NOT NULL,
ALTER COLUMN "start_conference_on_enter" DROP NOT NULL,
ALTER COLUMN "hold" DROP NOT NULL,
ALTER COLUMN "muted" DROP NOT NULL,
ALTER COLUMN "call_sid_ending_conference" DROP NOT NULL;
