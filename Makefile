.DEFAULT_GOAL := reset

reset: stop start dev

start:
	supabase start --exclude gotrue,imgproxy,pgadmin-schema-diff,migra,deno-relay,inbucket
	npm run migrate
	pm2 start "ngrok http --domain=dev.raisemore.app 3000"

dev:
	npm run dev

stop:
	supabase stop
	pkill node || true
	pm2 delete all || true

nuke: stop

lint:
	npm run lint

test: quick runtestandstop

runtestandstop:
	npm run test
	pkill node || true

newtest: stop start codegen stop
	
codegen:
	npm run dev &
	npx playwright codegen localhost:3000

debugtests: stop start runtestdebugandstop

quick:
	pkill node || true
	pm2 restart all
	psql "postgresql://postgres:postgres@localhost:54322/postgres" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
	psql "postgresql://postgres:postgres@localhost:54322/postgres" -f ./supabase/seed.sql
	npm run migrate