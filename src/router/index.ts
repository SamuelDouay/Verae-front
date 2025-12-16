import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresGuest: true }
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
      props: true // Passe les paramètres comme props au composant
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
})

// Garde de route
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('from', from.fullPath, 'to', to.fullPath)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
