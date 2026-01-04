import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { safeRedirect, generateSecureRedirect } from '@/utils/navigation'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      requiresGuest: true,
      redirectParam: 'redirect'
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/survey',
    name: 'survey',
    component: () => import('@/views/SurveyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/survey/:slug',
    name: 'survey-slug',
    component: () => import('@/views/SurveyDetailPage.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfilPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de route
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('🔀 Navigation:', from.fullPath, '→', to.fullPath)

  // 1. Route nécessitant une authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('🔒 Accès refusé, redirection vers login')
    next(generateSecureRedirect(to.fullPath))
    return
  }

  // 2. Route interdite aux utilisateurs connectés
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('⚠️ Utilisateur déjà connecté')

    // Gestion spéciale pour le login avec redirect
    if (to.name === 'login' && to.query.redirect) {
      const redirectParam = Array.isArray(to.query.redirect)
        ? to.query.redirect[0]
        : to.query.redirect

      const safePath = safeRedirect(redirectParam, '/')
      console.log('🎯 Redirection directe après login:', safePath)
      next(safePath)
      return
    }

    next('/')
    return
  }

  // 3. Navigation normale
  next()
})

export default router
