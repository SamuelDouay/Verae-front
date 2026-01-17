import { BaseService } from './base.api'
import { apiService } from '@/services/api'
import type { User } from '@/types/user'

class UserService extends BaseService<User> {
  constructor() {
    super('users')
  }

  // Surcharger ou ajouter des méthodes spécifiques
  async getMe(): Promise<User> {
    return apiService.http.get<User>('/users/me')
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.http.put<User>('/users/profile', data)
  }
}

export const userService = new UserService()
