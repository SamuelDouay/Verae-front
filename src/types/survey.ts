export interface Survey {
  id?: number;
  name: string;
  anonymization?: string;
  description?: string;
  userId: number;
  quiz?: boolean;
  active?: boolean;
  editing?: boolean;
  shareToken?: string;
  public?: boolean;
}

export interface SurveyStats {
  totalSurveys: number;
  activeSurveys: number;
  publicSurveys: number;
  quizSurveys: number;
  averageQuestionsPerSurvey?: number;
}

export interface UpdateDescriptionRequest {
  description: string;
}

export interface UpdateNameRequest {
  name: string;
}

export interface SurveyFilter {
  limit?: number;
  offset?: number;
  status?: boolean;
  userId?: number;
}
