# definiciones de comandos
# ejecutar así "make <comando>"

.PHONY: deploy run stop kill run-backend run-frontend

deploy: # docker compose up -d lo hace automáticamente
	(cd ./backend && sudo npm install)
	(cd ./frontend && sudo npm install)

run:
	docker compose up -d

stop:
	docker compose down

kill: # elimina los volúmenes
	docker compose down -v

run-backend:
	docker compose up -d postgres backend

run-frontend:
	docker compose up -d tailwind frontend  
