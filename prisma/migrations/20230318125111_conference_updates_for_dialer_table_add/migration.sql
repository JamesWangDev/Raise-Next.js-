-- CreateTable
CREATE TABLE "conference_updates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "coaching" BOOLEAN NOT NULL,
    "friendly_name" TEXT NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "conference_sid" TEXT NOT NULL,
    "end_conference_on_exit" BOOLEAN NOT NULL,
    "call_sid" TEXT NOT NULL,
    "status_callback_event" TEXT NOT NULL,
    "start_conference_on_enter" BOOLEAN NOT NULL,
    "hold" BOOLEAN NOT NULL,
    "account_sid" TEXT NOT NULL,
    "muted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conference_updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conference_updates_id_key" ON "conference_updates"("id");
