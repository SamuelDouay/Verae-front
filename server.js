// server.js - CONFIGURATION CSP COMPLÈTE
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

console.log(`🚀 Démarrage en mode  PROD`)

// 1️⃣ CONFIGURATION CSP - CRITIQUE
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Base
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],

        // Scripts - config optimisée pour Vue 3 + Vite
        scriptSrc: ["'self'"].filter(Boolean),

        // Bloque les attributs inline (onclick="...")
        scriptSrcAttr: ["'none'"],

        // Styles - PrimeVue nécessite 'unsafe-inline'
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // ⚠️ Obligatoire pour PrimeVue
          'https://fonts.googleapis.com',
        ],

        // Images
        imgSrc: [
          "'self'",
          'data:', // Images base64
          'blob:', // Uploads de fichiers
          'https:', // Images externes HTTPS
        ],

        // Connexions (API, WebSockets)
        connectSrc: [
          "'self'",
          // Ton backend API
          process.env.VITE_API_URL,
        ].filter(Boolean),

        // Fonts
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],

        // Media
        mediaSrc: ["'self'"],

        // Bloque les objets dangereux
        objectSrc: ["'none'"],

        // Bloque les iframes
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],

        // Formulaires
        formAction: ["'self'"],

        // Workers
        workerSrc: ["'self'", 'blob:'],

        // Manifest
        manifestSrc: ["'self'"],
      },
    },

    // Autres headers de sécurité
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
  }),
)

// Gzip
app.use(compression())

app.use(
  cors({
    origin: process.env.CORS_DOMAIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['Authorization'],
  }),
)

// Static files
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Pas de cache pour le HTML
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
      }
    },
  }),
)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: process.env.NODE_ENV,
    cspEnabled: true,
  })
})

// Endpoint pour les rapports CSP
app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body?.['csp-report']

  if (report) {
    console.warn('🚨 VIOLATION CSP:', {
      timestamp: new Date().toISOString(),
      url: report['document-uri'],
      blocked: report['blocked-uri'],
      violation: report['violated-directive'],
      ip: req.ip,
    })
  }

  res.status(204).send()
})

// SPA fallback - TOUJOURS À LA FIN
app.get(/^(?!\/?(api|health|csp-report|\.well-known)).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err)
  res.status(500).json({
    error: 'Internal server error',
  })
})

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${process.env.PORT}`)
  console.log(`📍 CORS origin: ${process.env.CORS_DOMAIN}`)
  console.log(`🛡️  CSP: STRICT `)
})
