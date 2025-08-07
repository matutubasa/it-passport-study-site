import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Question, ExamField, AnswerRecord } from '../../types';
import QuestionCard from '../../components/QuestionCard';
import { shuffleQuestions } from '../../utils/examLogic';
import questionsData from '../../data/questions.json';

const Study: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedField, setSelectedField] = useState<ExamField | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    answered: 0,
    correct: 0
  });

  const fields = [
    {
      key: ExamField.STRATEGY,
      name: 'ストラテジ系',
      description: '企業と法務、経営戦略、システム戦略',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      icon: '🏢'
    },
    {
      key: ExamField.MANAGEMENT,
      name: 'マネジメント系',
      description: '開発技術、プロジェクトマネジメント、サービスマネジメント',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      icon: '⚙️'
    },
    {
      key: ExamField.TECHNOLOGY,
      name: 'テクノロジ系',
      description: '基礎理論、コンピュータシステム、技術要素',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      icon: '💻'
    }
  ];

  // 分野を選択した時の処理
  const handleFieldSelect = (field: ExamField) => {
    setSelectedField(field);
    const fieldQuestions = (questionsData as Question[]).filter(q => q.field === field);
    const shuffledQuestions = shuffleQuestions(fieldQuestions);
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionStats({ answered: 0, correct: 0 });
    
    // セッション開始
    dispatch({ type: 'START_SESSION', payload: { field } });
  };

  // 回答処理
  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // 回答記録を作成
    const answerRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timestamp: new Date(),
      timeSpent: 0 // 簡単のため0に設定（実際は時間計測が必要）
    };
    
    // 状態更新
    dispatch({ type: 'ADD_ANSWER', payload: answerRecord });
    
    // セッション統計更新
    setSessionStats(prev => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));
    
    setShowResult(true);
  };

  // 次の問題へ
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // 前の問題へ
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // セッション終了
  const handleEndSession = () => {
    dispatch({ type: 'END_SESSION' });
    setSelectedField(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionStats({ answered: 0, correct: 0 });
  };

  // 現在の問題
  const currentQuestion = questions[currentQuestionIndex];

  // 分野選択画面
  if (!selectedField) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">分野別学習</h1>
            <p className="text-lg text-gray-600">
              学習したい分野を選択してください
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {fields.map((field) => {
              const fieldProgress = state.studyProgress.fieldProgress[field.key];
              const accuracy = fieldProgress.answeredQuestions > 0 
                ? Math.round((fieldProgress.correctAnswers / fieldProgress.answeredQuestions) * 100)
                : 0;

              return (
                <button
                  key={field.key}
                  onClick={() => handleFieldSelect(field.key)}
                  className={`text-left border-2 rounded-lg p-6 transition-colors ${field.color}`}
                >
                  <div className="text-4xl mb-4">{field.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {field.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {field.description}
                  </p>
                  
                  {/* 進捗表示 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">回答済み</span>
                      <span className="font-medium">{fieldProgress.answeredQuestions}問</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">正答率</span>
                      <span className="font-medium">{accuracy}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 学習画面
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={handleEndSession}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← 分野選択に戻る
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {fields.find(f => f.key === selectedField)?.name}
              </h1>
            </div>
            
            {/* セッション統計 */}
            <div className="bg-white rounded-lg shadow-md p-4 min-w-[200px]">
              <div className="text-sm text-gray-600">今回のセッション</div>
              <div className="flex justify-between mt-1">
                <span>回答数: {sessionStats.answered}問</span>
                <span>正答率: {sessionStats.answered > 0 ? Math.round((sessionStats.correct / sessionStats.answered) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                問題 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% 完了
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 問題表示 */}
        {currentQuestion && (
          <div className="mb-8">
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              showResult={showResult}
              selectedAnswer={selectedAnswer ?? undefined}
            />
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            前の問題
          </button>

          <div className="flex items-center space-x-4">
            {showResult && (
              <div className={`px-4 py-2 rounded-lg font-medium ${
                selectedAnswer === currentQuestion?.correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedAnswer === currentQuestion?.correctAnswer ? '正解!' : '不正解'}
              </div>
            )}
            
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === questions.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              次の問題
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;