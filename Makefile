.DEFAULT_GOAL := reset

reset: stop start

start:
	supabase start --exclude gotrue,imgproxy,pgadmin-schema-diff,migra,deno-relay,inbucket
	npm run migrate
	npm run dev

stop:
	supabase stop
	pkill node || true

nuke: stop

lint:
	npm run lint

test:
	npm run test
