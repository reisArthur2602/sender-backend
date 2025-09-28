FROM node:20-alpine 
WORKDIR /app
RUN apk add --no-cache openssl && apk add --no-cache bash
