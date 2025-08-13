import React, { useState } from 'react';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedAnswer: number) => void;
  showResult?: boolean;
  selectedAnswer?: number;
  showExplanation?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  showResult = false,
  selectedAnswer,
  showExplanation = false
}) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(null);

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return; // 結果表示中は選択不可
    
    setLocalSelectedAnswer(optionIndex);
    onAnswer(optionIndex);
  };

  const getOptionClassName = (optionIndex: number) => {
    const baseClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md";
    
    if (!showResult) {
      // 未回答時または回答前
      const isSelected = localSelectedAnswer === optionIndex || selectedAnswer === optionIndex;
      return `${baseClass} ${
        isSelected
          ? 'bg-primary-50 border-primary-300 text-primary-700'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`;
    }
    
    // 結果表示時
    const isCorrect = optionIndex === question.correctAnswer;
    const isSelected = selectedAnswer === optionIndex;
    
    if (isCorrect) {
      return `${baseClass} bg-green-50 border-green-300 text-green-800`;
    } else if (isSelected && !isCorrect) {
      return `${baseClass} bg-red-50 border-red-300 text-red-800`;
    } else {
      return `${baseClass} bg-gray-50 border-gray-200 text-gray-600`;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'strategy': return 'ストラテジ系';
      case 'management': return 'マネジメント系';
      case 'technology': return 'テクノロジ系';
      default: return field;
    }
  };

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'strategy': return 'bg-blue-100 text-blue-800';
      case 'management': return 'bg-green-100 text-green-800';
      case 'technology': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      {/* 問題ヘッダー */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFieldColor(question.field)}`}>
          {getFieldLabel(question.field)}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          {question.category}
        </span>
        <span className="text-sm text-gray-500 ml-auto">
          問題ID: {question.id}
        </span>
      </div>

      {/* 問題文 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* 選択肢 */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={getOptionClassName(index)}
            disabled={showResult}
          >
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {showResult && index === question.correctAnswer && (
                <span className="text-green-600">✓</span>
              )}
              {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                <span className="text-red-600">✗</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* 解説（結果表示時または明示的に表示指定時） */}
      {(showResult || showExplanation) && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">解説</h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            {question.explanation}
          </p>
          
          {question.keyPoints && question.keyPoints.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">重要ポイント</h5>
              <ul className="list-disc list-inside space-y-1">
                {question.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {question.references && question.references.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">参考資料</h5>
              <ul className="list-disc list-inside space-y-1">
                {question.references.map((ref, index) => (
                  <li key={index} className="text-sm text-blue-600">{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;