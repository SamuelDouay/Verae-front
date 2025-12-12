export interface Question {
  id?: number;
  title: string;
  description?: string;
  surveyId?: number;
  mandatory?: boolean;
  correctAnswer?: string;
  displayOrder?: number;
}

export interface QuestionStats {
  totalQuestions: number;
  mandatoryQuestions: number;
  quizQuestions: number;
  averageCorrectAnswers?: number;
}

export interface QuestionReorderRequest {
  questionIds: number[];
}

export interface UpdateCorrectAnswerRequest {
  correctAnswer: string;
}

export interface UpdateDisplayOrderRequest {
  order: number;
}
