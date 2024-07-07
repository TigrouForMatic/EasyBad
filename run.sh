#!/bin/bash

cd ./APP/ClubMaster-APP

npm run build
if [ $? -ne 0 ]; then
  echo "Erreur de build"
  exit 1
fi

cd ../../

docker-compose up -d --build

