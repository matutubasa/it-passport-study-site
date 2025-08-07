import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Question, AnswerRecord } from '../../types';
import QuestionCard from '../../components/QuestionCard';
import ExamTimer from '../../components/ExamTimer';
import { createMockExam, createMockExamResult, EXAM_CONFIG } from '../../utils/examLogic';
import questionsData from '../../data/questions.json';

type ExamState = 'setup' | 'in-progress' | 'completed';

const MockExam: React.FC = () => {
  const { state, dispatch } = useApp();
  const [examState, setExamState] = useState<ExamState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // 試験開始
  const startExam = () => {
    const examQuestions = createMockExam(questionsData as Question[]);
    setQuestions(examQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
    setExamState('in-progress');
  };

  // 回答処理
  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  // 問題ナビゲーション
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // 試験終了
  const finishExam = () => {
    const answerRecords: AnswerRecord[] = questions.map(question => ({
      questionId: question.id,
      selectedAnswer: answers[question.id] ?? -1,
      isCorrect: (answers[question.id] ?? -1) === question.correctAnswer,
      timestamp: new Date(),
      timeSpent: 0
    }));

    const result = createMockExamResult(answerRecords, questions, timeSpent);
    dispatch({ type: 'ADD_MOCK_EXAM_RESULT', payload: result });
    setExamState('completed');
  };

  // 時間切れ
  const handleTimeUp = () => {
    finishExam();
  };

  // 時間更新
  const handleTimeChange = (timeRemaining: number) => {
    setTimeSpent(EXAM_CONFIG.TIME_LIMIT_MINUTES * 60 - timeRemaining);
  };

  // 最新の試験結果
  const latestResult = state.mockExamResults[state.mockExamResults.length - 1];

  // セットアップ画面
  if (examState === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">ITパスポート模擬試験</h1>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">試験概要</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <div className="font-medium text-blue-800">問題数</div>
                    <div className="text-blue-700">{EXAM_CONFIG.TOTAL_QUESTIONS}問</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">試験時間</div>
                    <div className="text-blue-700">{EXAM_CONFIG.TIME_LIMIT_MINUTES}分</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">合格基準</div>
                    <div className="text-blue-700">総合{EXAM_CONFIG.PASSING_SCORE}点以上</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">分野別基準</div>
                    <div className="text-blue-700">各分野300点以上</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">注意事項</h3>
                <ul className="text-left text-yellow-800 space-y-1">
                  <li>• 試験開始後は中断できません</li>
                  <li>• 時間内に全問題に回答してください</li>
                  <li>• 各問題は何度でも変更可能です</li>
                  <li>• 制限時間に達すると自動的に終了します</li>
                </ul>
              </div>

              {state.mockExamResults.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">前回の結果</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {state.mockExamResults[state.mockExamResults.length - 1].score}
                      </div>
                      <div className="text-sm text-gray-600">点数</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${
                        state.mockExamResults[state.mockExamResults.length - 1].passed 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {state.mockExamResults[state.mockExamResults.length - 1].passed ? '合格' : '不合格'}
                      </div>
                      <div className="text-sm text-gray-600">判定</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-700">
                        {state.mockExamResults[state.mockExamResults.length - 1].correctAnswers}
                      </div>
                      <div className="text-sm text-gray-600">正解数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-700">
                        {state.mockExamResults.length}
                      </div>
                      <div className="text-sm text-gray-600">受験回数</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={startExam}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                試験を開始する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 試験中画面
  if (examState === 'in-progress') {
    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const unansweredQuestions = questions.filter(q => !(q.id in answers));

    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ヘッダー */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">ITパスポート模擬試験</h1>
                <div className="text-sm text-gray-600">
                  問題 {currentQuestionIndex + 1} / {questions.length}
                  （回答済み: {answeredCount}問）
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ExamTimer
                  totalTimeMinutes={EXAM_CONFIG.TIME_LIMIT_MINUTES}
                  onTimeUp={handleTimeUp}
                  onTimeChange={handleTimeChange}
                />
                
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  試験終了
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* 問題一覧 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">問題一覧</h3>
                <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-primary-600 text-white'
                          : questions[index].id in answers
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                {unansweredQuestions.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm font-medium text-yellow-800">
                      未回答: {unansweredQuestions.length}問
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 問題表示エリア */}
            <div className="lg:col-span-3">
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[currentQuestion.id]}
                />
              )}
              
              {/* ナビゲーション */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => goToQuestion(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  前の問題
                </button>

                <button
                  onClick={() => goToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
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

        {/* 終了確認ダイアログ */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">試験を終了しますか？</h3>
              <p className="text-gray-600 mb-6">
                未回答の問題が{unansweredQuestions.length}問あります。終了すると変更できません。
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  キャンセル
                </button>
                <button
                  onClick={finishExam}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  終了する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 結果画面
  if (examState === 'completed' && latestResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">試験結果</h1>
              
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-xl font-bold ${
                latestResult.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {latestResult.passed ? '🎉 合格' : '😞 不合格'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">総合結果</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>総合得点</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {latestResult.score}点
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>正解数</span>
                    <span>{latestResult.correctAnswers} / {latestResult.totalQuestions}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span>正答率</span>
                    <span>{Math.round((latestResult.correctAnswers / latestResult.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>試験時間</span>
                    <span>{Math.floor(latestResult.timeSpent / 60)}分{latestResult.timeSpent % 60}秒</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">分野別得点</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>ストラテジ系</span>
                    <span className={`font-bold ${
                      latestResult.fieldScores.strategy >= 300 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestResult.fieldScores.strategy}点
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>マネジメント系</span>
                    <span className={`font-bold ${
                      latestResult.fieldScores.management >= 300 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestResult.fieldScores.management}点
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>テクノロジ系</span>
                    <span className={`font-bold ${
                      latestResult.fieldScores.technology >= 300 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {latestResult.fieldScores.technology}点
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  ※ 各分野300点以上で合格
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setExamState('setup')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                再度受験する
              </button>
              <button
                onClick={() => window.location.href = '/progress'}
                className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                詳細分析を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MockExam;