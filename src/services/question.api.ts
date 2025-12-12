import { apiService } from '@/services/api';
import type { Question } from '@/types/question';

export function getAll(): Promise<Question[]> {
  return apiService.get<Question[]>('/questions');
}

export function getQuestionById(id: number): Promise<Question> {
  return apiService.get<Question>(`/questions/${id}`);
}

export function createQuestion(question: Partial<Question>): Promise<Question> {
  return apiService.post<Question>('/questions', question);
}

export function updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
  return apiService.put<Question>(`/questions/${id}`, question);
}

export function deleteQuestion(id: number): Promise<void> {
  return apiService.delete<void>(`/questions/${id}`);
}
