#!/bin/bash

CONTAINER_NAME="mongodb-aut"
PORT=27017

echo "Managing MongoDB Container..."

# Check if container exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "Container $CONTAINER_NAME is already running."
    else
        echo "Starting existing container $CONTAINER_NAME..."
        docker start $CONTAINER_NAME
    fi
else
    echo "Creating and starting new container $CONTAINER_NAME..."
    docker run -d --name $CONTAINER_NAME -p $PORT:27017 mongo:latest
fi

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until docker exec $CONTAINER_NAME mongosh --eval "print(\"waited for connection\")" &>/dev/null; do
    printf "."
    sleep 2
done
echo ""
echo "MongoDB is up and running!"

# Seed Data
echo "Seeding data..."
npm run seed

echo "Database setup complete."
