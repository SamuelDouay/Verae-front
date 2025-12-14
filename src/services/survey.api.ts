import { BaseService } from './base.api';
import { Survey } from '@/types/survey';

class SurveyService extends BaseService<Survey> {
  constructor() {
    super('survey');
  }
}

export const surveyService = new SurveyService();
