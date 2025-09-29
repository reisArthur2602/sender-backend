#!/bin/bash

echo "Instalando Depêndencias..."
npm install

echo "Rodando Migrations..."
npx prisma migrate deploy

echo "Iniciando aplicação..."
npm run dev
