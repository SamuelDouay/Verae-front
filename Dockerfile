# Stage 1: Builder
FROM node:22.20.0-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer npm-run-all globalement ou localement
RUN npm install -g npm-run-all

# Installer toutes les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM node:22.20.0-alpine

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer seulement production
RUN npm ci --only=production

# Copier dist
COPY --from=builder /app/dist ./dist

# Copier serveur
COPY server.js ./

# User non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]