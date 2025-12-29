import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const allowedHosts =
    mode === 'production'
      ? [env.CORS_DOMAIN]
      : ['localhost', '127.0.0.1', env.CORS_DOMAIN]

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      vueJsx(),
      vueDevTools(),
    ],
    server: {
      host: '0.0.0.0',
      allowedHosts,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('❌ Erreur proxy:', err.message)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              const origin = env.CORS_DOMAIN || 'http://localhost'
              proxyReq.setHeader('Origin', origin)
              console.log('📤 Proxy vers backend:', req.method, req.url, '→', proxyReq.path)
              console.log('   Origin forcé:', origin)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('📥 Réponse backend:', proxyRes.statusCode, req.url)
            })
          },
        },
      },
      cors: {
        origin: [env.CORS_DOMAIN],
        credentials: true,
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },
    build: {
      minify: 'esbuild',
      esbuild: mode === 'production' ? {
        drop: ['console', 'debugger'],
      } : undefined,
      // Augmenter la limite si nécessaire (optionnel)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Séparer node_modules en chunks distincts
            if (id.includes('node_modules')) {
              // Vue core
              if (id.includes('vue') || id.includes('@vue')) {
                return 'vendor-vue'
              }
              // PrimeVue (probablement la plus grosse dépendance)
              if (id.includes('primevue') || id.includes('@primevue')) {
                return 'vendor-primevue'
              }
              // Router et state management
              if (id.includes('vue-router') || id.includes('pinia')) {
                return 'vendor-router-state'
              }
              // Autres bibliothèques
              return 'vendor-other'
            }
          },
          // Nommer les chunks de manière cohérente
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      sourcemap: mode !== 'production',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
