FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm --prefix frontend ci
COPY frontend ./frontend
RUN npm --prefix frontend run build

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm --prefix backend ci

WORKDIR /app/backend
COPY backend/prisma.config.ts ./
COPY backend/prisma ./prisma
COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/scripts ./scripts
RUN npm run build \
    && mkdir -p public \
    && cp -R /app/frontend/dist/. public/

ENV NODE_ENV=production
ENV PORT=9090
ENV STATIC_DIR=public

EXPOSE 9090

CMD ["sh", "-c", "npm run db:deploy && npm start"]
