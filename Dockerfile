FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY . .

RUN npm install -g pm2 typescript && npm install
RUN chmod +x .docker/entrypoint.sh
RUN apk add --no-cache postgresql-client
