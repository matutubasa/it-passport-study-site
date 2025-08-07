import React from 'react';
import { useApp } from '../../contexts/AppContext';
import ProgressChart from '../../components/ProgressChart';
import { calculateAccuracy, formatStudyTime } from '../../utils/examLogic';
import { ExamField } from '../../types';

const Progress: React.FC = () => {
  const { state } = useApp();
  const { studyProgress, answerHistory, mockExamResults } = state;

  const overallAccuracy = calculateAccuracy(answerHistory);
  const bestScore = mockExamResults.length > 0 
    ? Math.max(...mockExamResults.map(r => r.score))
    : 0;
  const passedExams = mockExamResults.filter(r => r.passed).length;

  const getFieldLabel = (field: ExamField) => {
    switch (field) {
      case ExamField.STRATEGY: return 'ストラテジ系';
      case ExamField.MANAGEMENT: return 'マネジメント系';
      case ExamField.TECHNOLOGY: return 'テクノロジ系';
    }
  };

  const getFieldIcon = (field: ExamField) => {
    switch (field) {
      case ExamField.STRATEGY: return '🏢';
      case ExamField.MANAGEMENT: return '⚙️';
      case ExamField.TECHNOLOGY: return '💻';
    }
  };

  const getFieldColor = (field: ExamField) => {
    switch (field) {
      case ExamField.STRATEGY: return 'bg-blue-50 border-blue-200';
      case ExamField.MANAGEMENT: return 'bg-green-50 border-green-200';
      case ExamField.TECHNOLOGY: return 'bg-purple-50 border-purple-200';
    }
  };

  // 苦手分野の特定
  const weakFields = Object.entries(studyProgress.fieldProgress)
    .filter(([_, progress]) => progress.answeredQuestions > 0 && progress.accuracy < 70)
    .map(([field, _]) => field as ExamField);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ページヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">学習進捗管理</h1>
          <p className="text-gray-600">あなたの学習状況と成果を確認できます</p>
        </div>

        {/* 主要統計 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📚</div>
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {studyProgress.answeredQuestions}
                </div>
                <div className="text-sm text-gray-600">総回答問題数</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🎯</div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {overallAccuracy}%
                </div>
                <div className="text-sm text-gray-600">全体正答率</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏱️</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatStudyTime(studyProgress.studyTime)}
                </div>
                <div className="text-sm text-gray-600">総学習時間</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏆</div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {bestScore}
                </div>
                <div className="text-sm text-gray-600">最高スコア</div>
              </div>
            </div>
          </div>
        </div>

        {/* チャートエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProgressChart
            studyProgress={studyProgress}
            mockExamResults={mockExamResults}
            type="field-accuracy"
          />
          
          <ProgressChart
            studyProgress={studyProgress}
            mockExamResults={mockExamResults}
            type="field-distribution"
          />
        </div>

        {mockExamResults.length > 0 && (
          <div className="mb-8">
            <ProgressChart
              studyProgress={studyProgress}
              mockExamResults={mockExamResults}
              type="score-trend"
            />
          </div>
        )}

        {/* 分野別詳細進捗 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">分野別詳細進捗</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(studyProgress.fieldProgress).map(([field, progress]) => (
              <div key={field} className={`border-2 rounded-lg p-6 ${getFieldColor(field as ExamField)}`}>
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{getFieldIcon(field as ExamField)}</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getFieldLabel(field as ExamField)}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">回答済み問題数</span>
                    <span className="font-medium">{progress.answeredQuestions}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">正解数</span>
                    <span className="font-medium">{progress.correctAnswers}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">正答率</span>
                    <span className={`font-bold ${
                      progress.accuracy >= 80 ? 'text-green-600' :
                      progress.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {progress.accuracy || 0}%
                    </span>
                  </div>

                  {/* 進捗バー */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>習得度</span>
                      <span>{progress.accuracy || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.accuracy >= 80 ? 'bg-green-500' :
                          progress.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, progress.accuracy || 0)}%` }}
                      />
                    </div>
                  </div>

                  {progress.answeredQuestions === 0 && (
                    <div className="text-center py-4">
                      <span className="text-gray-500 text-sm">まだ学習していません</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 模擬試験結果 */}
        {mockExamResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">模擬試験結果履歴</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        試験日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        総合得点
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        正解数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        試験時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        判定
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockExamResults
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((result, index) => (
                      <tr key={result.id} className={index === 0 ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(result.date).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-primary-600">
                            {result.score}点
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {result.correctAnswers} / {result.totalQuestions}問
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.floor(result.timeSpent / 60)}分{result.timeSpent % 60}秒
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            result.passed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.passed ? '合格' : '不合格'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 模擬試験統計 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {mockExamResults.length}
                </div>
                <div className="text-sm text-gray-600">受験回数</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {passedExams}
                </div>
                <div className="text-sm text-gray-600">合格回数</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {mockExamResults.length > 0 ? Math.round((passedExams / mockExamResults.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">合格率</div>
              </div>
            </div>
          </div>
        )}

        {/* 苦手分野と推奨学習 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 苦手分野 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">苦手分野</h3>
            {weakFields.length > 0 ? (
              <div className="space-y-3">
                {weakFields.map(field => {
                  const progress = studyProgress.fieldProgress[field];
                  return (
                    <div key={field} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getFieldIcon(field)}</span>
                        <div>
                          <div className="font-medium text-red-800">
                            {getFieldLabel(field)}
                          </div>
                          <div className="text-sm text-red-600">
                            正答率: {progress.accuracy}%
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = '/study'}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        学習する
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-gray-500">苦手分野はありません🎉</span>
                <div className="text-sm text-gray-400 mt-1">
                  すべての分野で70%以上の正答率を維持しています
                </div>
              </div>
            )}
          </div>

          {/* 学習推奨 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">学習推奨</h3>
            <div className="space-y-4">
              {studyProgress.answeredQuestions < 50 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">まずは基礎固めを</div>
                  <div className="text-sm text-blue-600 mt-1">
                    各分野を均等に学習しましょう。まずは50問を目標に！
                  </div>
                </div>
              )}

              {mockExamResults.length === 0 && studyProgress.answeredQuestions >= 20 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">模擬試験に挑戦</div>
                  <div className="text-sm text-green-600 mt-1">
                    実力を測るために模擬試験を受けてみましょう！
                  </div>
                </div>
              )}

              {overallAccuracy >= 80 && mockExamResults.filter(r => r.passed).length === 0 && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">合格圏内です</div>
                  <div className="text-sm text-purple-600 mt-1">
                    高い正答率を維持しています。本番形式で練習しましょう！
                  </div>
                </div>
              )}

              {mockExamResults.filter(r => r.passed).length > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-800">合格レベル到達</div>
                  <div className="text-sm text-yellow-600 mt-1">
                    安定して合格できるよう継続学習を心がけましょう！
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;