import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // sinon ça casse vite/PrimeVue souvent
  })
);

// Gzip
app.use(compression());

// CORS (laisse Simple)
app.use(
  cors({
    origin: process.env.CORS_DOMAIN,
    credentials: true,
  })
);

// Static files
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  })
);

// Health check → IMPORTANT : AVANT le fallback
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// SPA fallback
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Proper error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Front running on port ${PORT}`);
});
