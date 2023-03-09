.DEFAULT_GOAL := reset

reset: stop start

start:
	open -a Docker
	supabase start --exclude gotrue,imgproxy,pgadmin-schema-diff,migra,deno-relay,inbucket --debug
	npm run migrate --debug
	npm run dev

stop:
	supabase stop
	pkill node || true

nuke: stop

lint:
	npm run lint

test:
	npm run test
