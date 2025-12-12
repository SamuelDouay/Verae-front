import { apiService } from '@/services/api';
import type { User } from '@/types/auth';

export function getUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
}

export function getUserById(userId: string): Promise<User> {
    return apiService.get<User>(`/users/${userId}`);
}

export function getMe(): Promise<User> {
    return apiService.get<User>('/users/me');
}

export function updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return apiService.put<User>(`/users/${userId}`, userData);
}

export function deleteUser(userId: string): Promise<void> {
    return apiService.delete<void>(`/users/${userId}`);
}
