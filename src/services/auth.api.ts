import { apiService } from '@/services/api';

import type { LoginRequest, RegisterRequest, AuthResponse, LoginResponse } from '@/types/auth';

export function apiLogin(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.http.post<LoginResponse>('/auth/login', credentials);
}

export function apiRegister(userData: RegisterRequest): Promise<AuthResponse> {
    return apiService.http.post<AuthResponse>('/auth/register', userData);
}

export function apiLogout(): Promise<void> {
    return apiService.http.post<void>('/auth/logout');
}
