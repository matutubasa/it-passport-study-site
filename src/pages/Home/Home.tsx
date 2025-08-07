import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { calculateAccuracy } from '../../utils/examLogic';

const Home: React.FC = () => {
  const { state } = useApp();
  const { studyProgress, answerHistory, mockExamResults } = state;

  const overallAccuracy = calculateAccuracy(answerHistory);
  const lastExamScore = mockExamResults.length > 0 
    ? mockExamResults[mockExamResults.length - 1].score 
    : null;

  const studyOptions = [
    {
      title: '分野別学習',
      description: 'ストラテジ系、マネジメント系、テクノロジ系の3分野を個別に学習',
      path: '/study',
      icon: '📚',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: '模擬試験',
      description: '本番同様の100問形式で実力をチェック（制限時間165分）',
      path: '/mock-exam',
      icon: '📝',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: '進捗管理',
      description: '学習状況の確認と苦手分野の分析',
      path: '/progress',
      icon: '📊',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];

  const quickStats = [
    {
      label: '学習問題数',
      value: studyProgress.answeredQuestions,
      unit: '問',
      color: 'text-blue-600'
    },
    {
      label: '正答率',
      value: overallAccuracy,
      unit: '%',
      color: 'text-green-600'
    },
    {
      label: '学習時間',
      value: Math.floor(studyProgress.studyTime / 60),
      unit: '時間',
      color: 'text-purple-600'
    },
    {
      label: '模擬試験回数',
      value: mockExamResults.length,
      unit: '回',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              ITパスポート試験 学習サイト
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              効率的な学習で合格を目指しましょう
            </p>
            
            {/* クイック統計 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 最近の学習状況 */}
        {(lastExamScore || studyProgress.answeredQuestions > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">学習状況</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {lastExamScore && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    最新の模擬試験結果
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-primary-600">
                      {lastExamScore}点
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lastExamScore >= 600 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lastExamScore >= 600 ? '合格' : '不合格'}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  学習進捗
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">問題回答数</span>
                    <span className="font-medium">{studyProgress.answeredQuestions}問</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">正答率</span>
                    <span className="font-medium">{overallAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">学習時間</span>
                    <span className="font-medium">
                      {Math.floor(studyProgress.studyTime / 60)}時間
                      {studyProgress.studyTime % 60}分
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 学習オプション */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">学習メニュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyOptions.map((option, index) => (
              <Link
                key={index}
                to={option.path}
                className={`block border-2 rounded-lg p-6 transition-colors ${option.color}`}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600">{option.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ITパスポート試験について */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ITパスポート試験について</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">試験概要</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 問題数：100問（多肢選択式）</li>
                <li>• 試験時間：165分（2時間45分）</li>
                <li>• 合格基準：総合評価点600点以上</li>
                <li>• 分野別評価点：各分野300点以上</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">出題分野</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <span className="font-medium text-blue-600">ストラテジ系</span>：企業と法務、経営戦略、システム戦略</li>
                <li>• <span className="font-medium text-green-600">マネジメント系</span>：開発技術、プロジェクトマネジメント、サービスマネジメント</li>
                <li>• <span className="font-medium text-purple-600">テクノロジ系</span>：基礎理論、コンピュータシステム、技術要素</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;