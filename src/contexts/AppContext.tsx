import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { StudyProgress, AnswerRecord, MockExamResult, ExamField } from '../types';

interface AppState {
  studyProgress: StudyProgress;
  answerHistory: AnswerRecord[];
  mockExamResults: MockExamResult[];
  currentSession: {
    startTime: Date | null;
    field: ExamField | null;
    questionsAnswered: number;
  };
}

type AppAction =
  | { type: 'ADD_ANSWER'; payload: AnswerRecord }
  | { type: 'START_SESSION'; payload: { field: ExamField } }
  | { type: 'END_SESSION' }
  | { type: 'ADD_MOCK_EXAM_RESULT'; payload: MockExamResult }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'RESET_DATA' };

const initialState: AppState = {
  studyProgress: {
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    fieldProgress: {
      [ExamField.STRATEGY]: {
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        weakCategories: []
      },
      [ExamField.MANAGEMENT]: {
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        weakCategories: []
      },
      [ExamField.TECHNOLOGY]: {
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        weakCategories: []
      }
    },
    studyTime: 0,
    lastStudied: new Date()
  },
  answerHistory: [],
  mockExamResults: [],
  currentSession: {
    startTime: null,
    field: null,
    questionsAnswered: 0
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ANSWER':
      const newAnswer = action.payload;
      const updatedHistory = [...state.answerHistory, newAnswer];
      
      // Update progress
      const newProgress = { ...state.studyProgress };
      newProgress.answeredQuestions += 1;
      if (newAnswer.isCorrect) {
        newProgress.correctAnswers += 1;
      }
      newProgress.lastStudied = new Date();
      
      return {
        ...state,
        answerHistory: updatedHistory,
        studyProgress: newProgress,
        currentSession: {
          ...state.currentSession,
          questionsAnswered: state.currentSession.questionsAnswered + 1
        }
      };
      
    case 'START_SESSION':
      return {
        ...state,
        currentSession: {
          startTime: new Date(),
          field: action.payload.field,
          questionsAnswered: 0
        }
      };
      
    case 'END_SESSION':
      const sessionDuration = state.currentSession.startTime 
        ? Math.floor((new Date().getTime() - state.currentSession.startTime.getTime()) / 60000)
        : 0;
        
      return {
        ...state,
        studyProgress: {
          ...state.studyProgress,
          studyTime: state.studyProgress.studyTime + sessionDuration
        },
        currentSession: {
          startTime: null,
          field: null,
          questionsAnswered: 0
        }
      };
      
    case 'ADD_MOCK_EXAM_RESULT':
      return {
        ...state,
        mockExamResults: [...state.mockExamResults, action.payload]
      };
      
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };
      
    case 'RESET_DATA':
      return initialState;
      
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('itpassport-study-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('itpassport-study-data', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};