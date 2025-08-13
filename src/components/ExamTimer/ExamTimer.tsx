import React, { useState, useEffect } from 'react';
import { formatExamTime } from '../../utils/examLogic';

interface ExamTimerProps {
  totalTimeMinutes: number;
  onTimeUp?: () => void;
  isRunning?: boolean;
  onTimeChange?: (timeRemaining: number) => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  totalTimeMinutes,
  onTimeUp,
  isRunning = true,
  onTimeChange
}) => {
  const [timeRemaining, setTimeRemaining] = useState(totalTimeMinutes * 60); // seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // 残り時間が30分(1800秒)以下で警告表示
        setIsWarning(newTime <= 1800);
        
        // 時間切れ
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        
        // 親コンポーネントに時間変更を通知
        onTimeChange?.(newTime);
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUp, onTimeChange]);

  const progressPercentage = (timeRemaining / (totalTimeMinutes * 60)) * 100;
  
  const getTimerColor = () => {
    if (timeRemaining <= 600) return 'text-red-600'; // 残り10分以下
    if (timeRemaining <= 1800) return 'text-yellow-600'; // 残り30分以下
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (timeRemaining <= 600) return 'bg-red-500'; // 残り10分以下
    if (timeRemaining <= 1800) return 'bg-yellow-500'; // 残り30分以下
    return 'bg-green-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isWarning ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">残り時間</h3>
        {isWarning && (
          <span className="text-yellow-600 text-sm font-medium animate-pulse">
            ⚠️ 時間に注意
          </span>
        )}
      </div>
      
      <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
        {formatExamTime(timeRemaining)}
      </div>
      
      {/* プログレスバー */}
      <div className="mt-3 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.max(0, progressPercentage)}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        {Math.floor(timeRemaining / 60)}分{timeRemaining % 60}秒
      </div>
      
      {timeRemaining <= 600 && timeRemaining > 0 && (
        <div className="mt-2 text-xs text-red-600 font-medium animate-pulse">
          あと{Math.floor(timeRemaining / 60)}分で時間切れです！
        </div>
      )}
    </div>
  );
};

export default ExamTimer;