export interface Material {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  type: 'text' | 'mindmap';
  order: number;
}

export interface Question {
  id: string;
  chapterId: number;
  type: 'single' | 'multiple' | 'short' | 'essay';
  content: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle?: string;
  materials: Material[];
  questionCount: number;
}

export interface UserProgress {
  chapterId: number;
  completed: boolean;
  progress: number;
  lastStudied: string;
}

export interface WrongQuestion {
  id: string;
  questionId: string;
  wrongCount: number;
  lastWrong: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface AnswerResult {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}
