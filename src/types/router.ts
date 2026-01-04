import type { RouteRecordRaw } from 'vue-router'

interface RouteMeta {
  /** Nécessite une authentification */
  requiresAuth?: boolean

  /** Interdit aux utilisateurs authentifiés (pour login/register) */
  requiresGuest?: boolean

  /** Nom du paramètre de redirection (défaut: 'redirect') */
  redirectParam?: string

  /** Rôles autorisés (pour les contrôles d'accès avancés) */
  allowedRoles?: string[]
}

// Si tu utilises RouteConfig, définis-le correctement
export interface RouteConfig extends Omit<RouteRecordRaw, 'meta'> {
  meta?: RouteMeta
}
