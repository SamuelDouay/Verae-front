# Stage 1: Builder
FROM node:22.20.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22.20.0-alpine

WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./  
# si server.js existe

# Installer UNIQUEMENT express, compression, helmet, cors
RUN npm ci --only=production

# Vérifier que les packages sont bien installés
RUN echo "Packages installés:" && npm list --depth=0 || true

# User non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Lancer le serveur
CMD ["node", "server.js"]