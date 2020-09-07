.PHONY: clean

start:
	docker-compose -f docker-compose.app.yml -f docker-compose.yml up -d --force-recreate --remove-orphans

build:
	docker-compose -f docker-compose.app.yml -f docker-compose.yml build

down:
	docker-compose -f docker-compose.app.yml -f docker-compose.yml down -v

bash:
	docker-compose -f docker-compose.app.yml -f docker-compose.yml run app ash
