export interface Answer {
  id?: number;
  idQuestion: number;
  originalAnswer?: string;
  anonymousAnswer?: string;
  respondentId: string;
  isCorrect?: boolean;
  submittedAt?: string;
  anonymous?: boolean;
}

export interface AnswerStats {
  totalAnswers: number;
  correctAnswers: number;
  anonymousAnswers: number;
  averageScore?: number;
  questionId: number;
}

export interface SurveyAnswersStats {
  surveyId: number;
  totalQuestions: number;
  totalAnswers: number;
  averageCompletionRate: number;
  questionStats: AnswerStats[];
}

export interface AnswerCheckRequest {
  respondentId: string;
  questionId: number;
}

export interface MarkAsCorrectRequest {
  isCorrect: boolean;
}
