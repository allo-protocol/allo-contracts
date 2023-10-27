.PHONY: docker-build docker-run docker-kill docker-stop docker-logs docker-deploy-contracts docker-all

IMAGE_NAME=allo
CONTAINER_NAME=allo

docker-all: docker-kill docker-build docker-run docker-deploy-contracts

docker-build:
		docker build . -t $(IMAGE_NAME) --no-cache --progress=plain

docker-run:
		docker run --name $(CONTAINER_NAME) --rm -d -p 127.0.0.1:8545:8545/tcp $(IMAGE_NAME)

docker-kill:
		-docker kill $(CONTAINER_NAME)

docker-stop:
		docker stop $(CONTAINER_NAME)

docker-logs:
		docker logs -f $(CONTAINER_NAME)

docker-deploy-contracts:
		docker exec allo bash ./docker/deploy-contracts.sh
