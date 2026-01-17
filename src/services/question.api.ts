import { BaseService } from './base.api';
import { apiService } from '@/services/api';
import type { Question } from '@/types/question';

class QuestionService extends BaseService<Question> {
  constructor() {
    super('questions');
  }

  // Méthodes spécifiques aux questions
  async getByCategory(categoryId: number): Promise<Question[]> {
    return apiService.http.get<Question[]>(`/questions/category/${categoryId}`);
  }

  async getByIdSurvey(surveyId: number): Promise<Question[]> {
    return apiService.http.get<Question[]>(`/questions/survey/${surveyId}`);
  }
}

export const questionService = new QuestionService();
