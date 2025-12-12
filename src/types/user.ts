export interface User {
  id?: number;
  name: string;
  surname: string;
  email: string;
  admin?: boolean;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  recentUsers: User[];
  averageSurveysPerUser?: number;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  email?: string;
}

export interface UserFilter {
  limit?: number;
  offset?: number;
  isAdmin?: boolean;
  name?: string;
}
