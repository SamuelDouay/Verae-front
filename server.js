// server.js - Serveur production optimisé
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.VITE_BACKEND_URL || ''],
    },
  },
  crossOriginEmbedderPolicy: false, // Important pour les assets
}))

// Compression Gzip/Brotli
app.use(compression())

// CORS configuré
app.use(cors({
  origin: process.env.CORS_DOMAIN || 'http://localhost',
  credentials: true,
  optionsSuccessStatus: 200
}))

// Headers de sécurité supplémentaires
app.use((req, res, next) => {
  // Headers de cache optimisés
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Sécurité
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  next()
})

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist'), {
  etag: true,
  lastModified: true,
  maxAge: '1y',
  setHeaders: (res, path) => {
    // Cache long pour les assets versionnés
    if (path.match(/\.[0-9a-f]{8}\./)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
  }
}))

// Route fallback pour SPA (doit être après les fichiers statiques)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  console.log(next)
  res.status(500).send('Something broke!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur frontend en production sur le port ${PORT}`)
  console.log(`🌐 CORS autorisé pour: ${process.env.CORS_DOMAIN || 'http://localhost'}`)
  console.log(`🔗 Backend URL: ${process.env.VITE_BACKEND_URL || 'Non défini'}`)
})
