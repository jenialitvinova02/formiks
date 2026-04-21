FROM node:20.19.0-alpine3.22 AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM deps AS build

COPY tsconfig.json ./
COPY index.ts ./
COPY app.ts ./
COPY db.ts ./
COPY seedLocalData.ts ./
COPY API.md ./
COPY database ./database
COPY constants ./constants
COPY errors ./errors
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY services ./services
COPY utils ./utils
COPY validators ./validators
RUN npm run build && npm prune --omit=dev

FROM node:20.19.0-alpine3.22 AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN addgroup -S formics && adduser -S formics -G formics \
  && mkdir -p /app/data \
  && chown -R formics:formics /app

USER formics

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/index.js"]
