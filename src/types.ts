export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export type AppState = 'welcome' | 'quiz' | 'results' | 'admin';

export interface QuizResult {
  score: number;
  total: number;
  userName: string;
}
