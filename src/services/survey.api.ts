import { apiService } from './api';
import { BaseService } from './base.api';
import { Survey } from '@/types/survey';

class SurveyService extends BaseService<Survey> {
  constructor() {
    super('survey');
  }

  async getServeysByUser(userId: number | undefined): Promise<Survey[]> {
    return apiService.http.get<Survey[]>(`/survey/user/${userId}`);
  }
}

export const surveyService = new SurveyService();
