import { apiService } from '@/services/api';
import type { User } from '@/types/auth';

export function getUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
}
