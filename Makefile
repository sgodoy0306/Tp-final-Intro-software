# definiciones de comandos para simplificar el arranque y frenado de la db y la api
# ejecutar así "make <comando>"

.PHONY: start-db stop-db start-api run-backend

start-db:
	cd ./backend && docker compose up -d

stop-db:
	cd ./backend && docker compose down

start-api: # para frenar usar CTRL + C 
	cd ./backend && npm run dev 

# arranca db y api a la vez 
run-backend: start-db start-api