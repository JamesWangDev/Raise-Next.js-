-- add call_sessions table to the supabase realtime replication service
alter publication supabase_realtime
add table call_sessions;
-- Disable RLS on call_sessions for dev right now becuase of RLS/realtime issues
ALTER TABLE call_sessions DISABLE ROW LEVEL SECURITY;DROP POLICY IF EXISTS call_sessions_org_id on call_sessions;