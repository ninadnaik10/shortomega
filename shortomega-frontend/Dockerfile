FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:18-alpine AS production

WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN yarn install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3001
CMD ["yarn", "start"]