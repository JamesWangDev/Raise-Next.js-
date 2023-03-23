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

test: stop start runtestandstop

runtestandstop:
	npm run test
	supabase stop
	pkill node || true
	pm2 delete all || true

runtestdebugandstop:
	npx playwright test --debug
	supabase stop
	pkill node || true
	pm2 delete all || true

newtest: stop start codegen stop
	
codegen:
	npm run dev &
	npx playwright codegen localhost:3000

debug tests: stop start runtestdebugandstop