export interface History {
  id?: number;
  idSurvey: number;
  action: string;
  snapshot: string;
  idUser: number;
  createdAt?: string;
}

export interface HistoryQuestion {
  id?: number;
  idQuestion: number;
  idSurvey: number;
  action: string;
  snapshot: string;
  idUser: number;
  createdAt?: string;
}

export interface HistoryStats {
  totalActions: number;
  byActionType: Record<string, number>;
  recentActivities: History[];
}

export interface RecordActionRequest {
  surveyId?: number;
  action: string;
  snapshot?: string;
  userId?: number;
}

export interface HistoryFilter {
  actions?: string[];
  limit?: number;
  offset?: number;
  days?: number;
}
