.DEFAULT_GOAL := reset

reset: stop start

start:
	npm run dev

stop:
	supabase stop
	pkill node || true

nuke: stop

lint:
	npm run lint

test:
	npm run test
