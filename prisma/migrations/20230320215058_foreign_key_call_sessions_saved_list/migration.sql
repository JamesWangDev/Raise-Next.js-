ALTER TABLE
  "call_sessions"
ADD
  CONSTRAINT "call_sessions_saved_lists_id_fkey" FOREIGN KEY ("list_id") REFERENCES "saved_lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;