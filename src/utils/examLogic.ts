import { Question, AnswerRecord, MockExamResult, ExamField } from '../types';

// ITパスポート試験の合格基準
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 100,
  TIME_LIMIT_MINUTES: 165,
  PASSING_SCORE: 600,
  MAX_SCORE: 1000,
  FIELD_DISTRIBUTION: {
    [ExamField.STRATEGY]: 35,    // ストラテジ系: 35問
    [ExamField.MANAGEMENT]: 20,  // マネジメント系: 20問  
    [ExamField.TECHNOLOGY]: 45   // テクノロジ系: 45問
  }
};

// 分野別の最低合格点（各分野で300点以上必要）
export const FIELD_PASSING_SCORES = {
  [ExamField.STRATEGY]: 300,
  [ExamField.MANAGEMENT]: 300,
  [ExamField.TECHNOLOGY]: 300
};

// 問題をシャッフルする
export const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 分野別に問題を選択して模擬試験を作成
export const createMockExam = (allQuestions: Question[]): Question[] => {
  const questionsByField = {
    [ExamField.STRATEGY]: allQuestions.filter(q => q.field === ExamField.STRATEGY),
    [ExamField.MANAGEMENT]: allQuestions.filter(q => q.field === ExamField.MANAGEMENT),
    [ExamField.TECHNOLOGY]: allQuestions.filter(q => q.field === ExamField.TECHNOLOGY)
  };

  const examQuestions: Question[] = [];

  // 各分野から指定数の問題を選択
  Object.entries(EXAM_CONFIG.FIELD_DISTRIBUTION).forEach(([field, count]) => {
    const fieldQuestions = questionsByField[field as ExamField];
    const shuffled = shuffleQuestions(fieldQuestions);
    const selected = shuffled.slice(0, Math.min(count, fieldQuestions.length));
    examQuestions.push(...selected);
  });

  // 全体をシャッフル
  return shuffleQuestions(examQuestions);
};

// 点数を計算（ITパスポートの採点方式）
export const calculateScore = (answers: AnswerRecord[], questions: Question[]): number => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  
  if (totalQuestions === 0) return 0;
  
  // 1000点満点で計算
  return Math.round((correctAnswers / totalQuestions) * EXAM_CONFIG.MAX_SCORE);
};

// 分野別点数を計算
export const calculateFieldScores = (answers: AnswerRecord[], questions: Question[]) => {
  const fieldScores = {
    [ExamField.STRATEGY]: 0,
    [ExamField.MANAGEMENT]: 0,
    [ExamField.TECHNOLOGY]: 0
  };

  Object.values(ExamField).forEach(field => {
    const fieldQuestions = questions.filter(q => q.field === field);
    const fieldAnswers = answers.filter(answer => 
      fieldQuestions.some(q => q.id === answer.questionId)
    );
    
    if (fieldQuestions.length > 0) {
      const correctCount = fieldAnswers.filter(answer => answer.isCorrect).length;
      fieldScores[field] = Math.round((correctCount / fieldQuestions.length) * EXAM_CONFIG.MAX_SCORE);
    }
  });

  return fieldScores;
};

// 合格判定
export const isPassingScore = (totalScore: number, fieldScores: { [key in ExamField]: number }): boolean => {
  // 総合点が600点以上かつ、各分野で300点以上
  const totalPassed = totalScore >= EXAM_CONFIG.PASSING_SCORE;
  const fieldsPassed = Object.values(ExamField).every(field => 
    fieldScores[field] >= FIELD_PASSING_SCORES[field]
  );
  
  return totalPassed && fieldsPassed;
};

// 模擬試験結果を作成
export const createMockExamResult = (
  answers: AnswerRecord[],
  questions: Question[],
  timeSpent: number
): MockExamResult => {
  const totalScore = calculateScore(answers, questions);
  const fieldScores = calculateFieldScores(answers, questions);
  const passed = isPassingScore(totalScore, fieldScores);

  return {
    id: `exam-${Date.now()}`,
    date: new Date(),
    score: totalScore,
    totalQuestions: questions.length,
    correctAnswers: answers.filter(a => a.isCorrect).length,
    timeSpent,
    fieldScores,
    passed,
    answers
  };
};

// 正答率を計算
export const calculateAccuracy = (answers: AnswerRecord[]): number => {
  if (answers.length === 0) return 0;
  const correct = answers.filter(answer => answer.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
};

// 苦手分野を特定
export const identifyWeakFields = (answers: AnswerRecord[], questions: Question[]): ExamField[] => {
  const fieldAccuracy = Object.values(ExamField).map(field => {
    const fieldQuestions = questions.filter(q => q.field === field);
    const fieldAnswers = answers.filter(answer => 
      fieldQuestions.some(q => q.id === answer.questionId)
    );
    
    const accuracy = calculateAccuracy(fieldAnswers);
    return { field, accuracy };
  });

  // 正答率が70%未満の分野を苦手分野とする
  return fieldAccuracy
    .filter(({ accuracy }) => accuracy < 70)
    .map(({ field }) => field);
};

// 学習時間をフォーマット
export const formatStudyTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}時間${mins}分`;
  }
  return `${mins}分`;
};

// 経過時間をフォーマット（試験用）
export const formatExamTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};