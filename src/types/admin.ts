export interface Metrics {
  totalSurveys: number;
  totalUsers: number;
  totalAnswers: number;
  activeSurveys: number;
  recentActivities: number;
  systemHealth: SystemHealth;
}

export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  database: boolean;
  memory: MemoryUsage;
  uptime: number;
  timestamp: string;
}

export interface MemoryUsage {
  total: number;
  free: number;
  used: number;
  percentage: number;
}

export interface HealthCheckResponse {
  status: string;
  components: Record<string, HealthComponent>;
}

export interface HealthComponent {
  status: string;
  details?: Record<string, any>;
}
