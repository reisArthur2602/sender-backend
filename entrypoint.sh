#!/bin/bash

echo "Instalando Pacotes..."
npm install

echo "Rodando Migrations..."
npx prisma migrate deploy

echo "Gerando Build..."
npm run build

echo "Iniciando aplicação..."
npm run start
