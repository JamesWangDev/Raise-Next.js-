.DEFAULT_GOAL := reset

reset: stop start dev

start:
	supabase start --exclude gotrue,imgproxy,pgadmin-schema-diff,migra,deno-relay,inbucket
	npm run migrate

dev:
	npm run dev

stop:
	supabase stop
	pkill node || true

nuke: stop

lint:
	npm run lint

test: stop start runtest stop

runtest:
	npm run test
	npm run test:e2e
