FROM node:24-alpine 
WORKDIR /app
RUN apk add --no-cache openssl && apk add --no-cache bash
