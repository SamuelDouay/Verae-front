// src/router/index.ts
import { createRouter, createWebHistory} from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { safeRedirect, generateSecureRedirect } from '@/utils/navigation'
import type { RouteConfig } from '@/types/router'

const routes: RouteConfig[] = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Garde de route AVEC DEBUG
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('🔍 DEBUG Router - Navigation:', {
    from: from.fullPath,
    to: to.fullPath,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
    queryRedirect: to.query.redirect
  })

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {

    const redirectUrl = generateSecureRedirect(to.fullPath)

    next(redirectUrl)
    return
  }

  // 2. Route interdite aux utilisateurs connectés
  if (to.meta.requiresGuest && authStore.isAuthenticated) {

    if (to.name === 'login' && to.query.redirect) {
      const redirectParam = Array.isArray(to.query.redirect)
        ? to.query.redirect[0]
        : to.query.redirect
      const safePath = safeRedirect(redirectParam, '/')

      next(safePath)
      return
    }

    next('/')
    return
  }
  next()
})

export default router
