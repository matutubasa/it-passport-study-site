import { StudyProgress, AnswerRecord, MockExamResult } from '../types';

const STORAGE_KEYS = {
  STUDY_PROGRESS: 'itpassport-study-progress',
  ANSWER_HISTORY: 'itpassport-answer-history',
  MOCK_EXAM_RESULTS: 'itpassport-mock-results',
  USER_PREFERENCES: 'itpassport-user-prefs'
};

export const storage = {
  // Save data to localStorage
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Load data from localStorage
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.remove(key);
    });
  }
};

// Specific storage functions
export const saveStudyProgress = (progress: StudyProgress) => {
  storage.save(STORAGE_KEYS.STUDY_PROGRESS, progress);
};

export const loadStudyProgress = (): StudyProgress | null => {
  return storage.load(STORAGE_KEYS.STUDY_PROGRESS, null);
};

export const saveAnswerHistory = (history: AnswerRecord[]) => {
  storage.save(STORAGE_KEYS.ANSWER_HISTORY, history);
};

export const loadAnswerHistory = (): AnswerRecord[] => {
  return storage.load(STORAGE_KEYS.ANSWER_HISTORY, []);
};

export const saveMockExamResults = (results: MockExamResult[]) => {
  storage.save(STORAGE_KEYS.MOCK_EXAM_RESULTS, results);
};

export const loadMockExamResults = (): MockExamResult[] => {
  return storage.load(STORAGE_KEYS.MOCK_EXAM_RESULTS, []);
};