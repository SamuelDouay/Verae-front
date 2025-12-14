import { BaseService } from './base.api';
import { Answer } from '@/types/answers';

class AnswerService extends BaseService<Answer> {
  constructor() {
    super('answers');
  }
}

export const answerService = new AnswerService();
