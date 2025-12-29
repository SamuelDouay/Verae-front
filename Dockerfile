# Stage 1: Builder
FROM node:22.20.0-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer dependencies
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM node:22.20.0-alpine

WORKDIR /app

# Copier package.json pour les dependencies de production
COPY package*.json ./

RUN npm ci --include=dev

# Copier les fichiers buildés
COPY --from=builder /app/dist ./dist

# Copier le serveur Express
COPY server.js ./

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server.js"]