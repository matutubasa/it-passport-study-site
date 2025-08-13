import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { StudyProgress, MockExamResult, ExamField } from '../../types';
import { calculateAccuracy } from '../../utils/examLogic';

interface ProgressChartProps {
  studyProgress: StudyProgress;
  mockExamResults: MockExamResult[];
  type?: 'field-accuracy' | 'score-trend' | 'field-distribution' | 'time-study';
}

const FIELD_COLORS = {
  [ExamField.STRATEGY]: '#3B82F6',
  [ExamField.MANAGEMENT]: '#10B981', 
  [ExamField.TECHNOLOGY]: '#8B5CF6'
};

const FIELD_LABELS = {
  [ExamField.STRATEGY]: 'ストラテジ系',
  [ExamField.MANAGEMENT]: 'マネジメント系',
  [ExamField.TECHNOLOGY]: 'テクノロジ系'
};

const ProgressChart: React.FC<ProgressChartProps> = ({
  studyProgress,
  mockExamResults,
  type = 'field-accuracy'
}) => {
  
  const renderFieldAccuracyChart = () => {
    const data = Object.entries(studyProgress.fieldProgress).map(([field, progress]) => ({
      field: FIELD_LABELS[field as ExamField],
      accuracy: progress.accuracy || 0,
      answered: progress.answeredQuestions,
      correct: progress.correctAnswers
    }));

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">分野別正答率</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="field" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => [
                `${value}%`, 
                name === 'accuracy' ? '正答率' : name
              ]}
              labelFormatter={(label) => `分野: ${label}`}
            />
            <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderScoreTrendChart = () => {
    const data = mockExamResults
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((result, index) => ({
        exam: `第${index + 1}回`,
        score: result.score,
        date: new Date(result.date).toLocaleDateString('ja-JP'),
        passed: result.passed
      }));

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">模擬試験スコア推移</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="exam" />
            <YAxis domain={[0, 1000]} />
            <Tooltip 
              formatter={(value) => [`${value}点`, 'スコア']}
              labelFormatter={(label) => `試験: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
            {/* 合格ライン */}
            <Line 
              type="monotone" 
              dataKey={() => 600} 
              stroke="#EF4444" 
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 bg-red-500 mr-1"></span>
          合格ライン（600点）
        </div>
      </div>
    );
  };

  const renderFieldDistributionChart = () => {
    const data = Object.entries(studyProgress.fieldProgress).map(([field, progress]) => ({
      name: FIELD_LABELS[field as ExamField],
      value: progress.answeredQuestions,
      color: FIELD_COLORS[field as ExamField]
    }));

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">分野別学習問題数分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => 
                `${name}: ${value}問 (${((percent || 0) * 100).toFixed(1)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTimeStudyChart = () => {
    // 簡単な学習時間表示（より詳細な統計が必要な場合は拡張）
    const totalHours = Math.floor(studyProgress.studyTime / 60);
    const totalMinutes = studyProgress.studyTime % 60;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">学習時間統計</h3>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {totalHours}時間{totalMinutes}分
          </div>
          <div className="text-gray-600">総学習時間</div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {studyProgress.answeredQuestions}
              </div>
              <div className="text-sm text-blue-800">回答済み問題数</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {calculateAccuracy([])}%
              </div>
              <div className="text-sm text-green-800">全体正答率</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (type) {
    case 'score-trend':
      return renderScoreTrendChart();
    case 'field-distribution':
      return renderFieldDistributionChart();
    case 'time-study':
      return renderTimeStudyChart();
    default:
      return renderFieldAccuracyChart();
  }
};

export default ProgressChart;