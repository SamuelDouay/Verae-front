import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';



// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  const allowedHosts = mode === 'production'
    ? [env.VITE_DOMAIN]  // Uniquement votre domaine en prod
    : ['localhost', '127.0.0.1', env.VITE_DOMAIN];  // Autoriser localhost en dev

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ]
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
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      },
      fs: {
        strict: true  // Restreint l'accès aux fichiers hors de dist/
      },
      build: {
        // Minifier pour la production
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,  // Supprime les console.log en production
            drop_debugger: true
          }
        },
        // Analyse de bundle
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['vue', 'vue-router', 'pinia'],
              primevue: ['primevue']
            }
          }
        },
        // Source maps seulement en dev
        sourcemap: mode !== 'production'
      },
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
