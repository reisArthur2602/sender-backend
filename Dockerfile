FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl
RUN apk add --no-cache postgresql-client

COPY . .

RUN npm install -g pm2 typescript && npm install
RUN chmod +x .docker/entrypoint.sh

