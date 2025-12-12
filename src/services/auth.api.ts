import { apiService } from '@/services/api';
import type { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '@/types/auth';

export function aapilogin(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
}

export function apiregister(userData: RegisterRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', userData);
}

export function apilogout(): Promise<void> {
    return apiService.post<void>('/auth/logout');
}
