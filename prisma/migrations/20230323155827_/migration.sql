-- Turn it back on! Works now.
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;ALTER TABLE call_sessions FORCE ROW LEVEL SECURITY;DROP POLICY IF EXISTS call_sessions_org_id on call_sessions;CREATE POLICY call_sessions_org_id ON call_sessions USING (organization_id = requesting_org_id());
