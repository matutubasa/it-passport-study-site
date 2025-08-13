// ITパスポート試験の3分野
export enum ExamField {
  STRATEGY = 'strategy', // ストラテジ系
  MANAGEMENT = 'management', // マネジメント系
  TECHNOLOGY = 'technology' // テクノロジ系
}

// 問題の種類
export interface Question {
  id: string;
  field: ExamField;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  keyPoints: string[];
  references?: string[];
}

// 回答記録
export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: Date;
  timeSpent: number; // seconds
}

// 学習進捗
export interface StudyProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  fieldProgress: {
    [ExamField.STRATEGY]: FieldProgress;
    [ExamField.MANAGEMENT]: FieldProgress;
    [ExamField.TECHNOLOGY]: FieldProgress;
  };
  studyTime: number; // total minutes
  lastStudied: Date;
}

// 分野別進捗
export interface FieldProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  accuracy: number;
  weakCategories: string[];
}

// 模擬試験結果
export interface MockExamResult {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // minutes
  fieldScores: {
    [ExamField.STRATEGY]: number;
    [ExamField.MANAGEMENT]: number;
    [ExamField.TECHNOLOGY]: number;
  };
  passed: boolean;
  answers: AnswerRecord[];
}

// 学習統計
export interface StudyStats {
  totalStudyTime: number;
  averageScore: number;
  bestScore: number;
  examsTaken: number;
  streakDays: number;
  weakestField: ExamField;
  strongestField: ExamField;
}