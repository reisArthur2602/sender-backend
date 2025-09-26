# build stage
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

# runtime stage
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production

CMD ["npm", "start"]
