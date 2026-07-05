import { create } from 'zustand';
import { Question, UserProgress, WrongQuestion, AnswerResult } from '../types';

interface AppState {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    isLoggedIn: boolean;
  };
  progress: UserProgress[];
  wrongQuestions: WrongQuestion[];
  examResults: AnswerResult[];
  currentQuestionIndex: number;
  isExamMode: boolean;
  examTimeRemaining: number;
  selectedChapter: number | null;
  selectedMaterial: string | null;
  favorites: string[];
  showLoginModal: boolean;
  
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProgress: (chapterId: number, progress: number) => void;
  addWrongQuestion: (questionId: string) => void;
  removeWrongQuestion: (questionId: string) => void;
  setExamResults: (results: AnswerResult[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setIsExamMode: (mode: boolean) => void;
  setExamTimeRemaining: (time: number) => void;
  setSelectedChapter: (chapterId: number | null) => void;
  setSelectedMaterial: (materialId: string | null) => void;
  toggleFavorite: (id: string) => void;
  setShowLoginModal: (show: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: '1',
    email: 'huangjingyu@example.com',
    name: '黄静宇',
    avatar: '',
    isLoggedIn: true,
  },
  progress: [],
  wrongQuestions: [],
  examResults: [],
  currentQuestionIndex: 0,
  isExamMode: false,
  examTimeRemaining: 0,
  selectedChapter: null,
  selectedMaterial: null,
  favorites: [],
  showLoginModal: false,

  login: (email, name) => set({ 
    user: { 
      id: '1', 
      email, 
      name, 
      avatar: '', 
      isLoggedIn: true 
    } 
  }),
  
  logout: () => set({ 
    user: { 
      id: '', 
      email: '', 
      name: '', 
      avatar: '', 
      isLoggedIn: false 
    },
    progress: [],
    wrongQuestions: [],
    favorites: [],
  }),
  
  updateProgress: (chapterId, progress) => set((state) => ({
    progress: state.progress
      .filter((p) => p.chapterId !== chapterId)
      .concat({
        chapterId,
        progress,
        completed: progress >= 100,
        lastStudied: new Date().toISOString(),
      }),
  })),
  
  addWrongQuestion: (questionId) => set((state) => {
    const existing = state.wrongQuestions.find((w) => w.questionId === questionId);
    if (existing) {
      return {
        wrongQuestions: state.wrongQuestions.map((w) =>
          w.questionId === questionId
            ? { ...w, wrongCount: w.wrongCount + 1, lastWrong: new Date().toISOString() }
            : w
        ),
      };
    }
    return {
      wrongQuestions: [
        ...state.wrongQuestions,
        {
          id: `wq-${Date.now()}`,
          questionId,
          wrongCount: 1,
          lastWrong: new Date().toISOString(),
        },
      ],
    };
  }),
  
  removeWrongQuestion: (questionId) => set((state) => ({
    wrongQuestions: state.wrongQuestions.filter((w) => w.questionId !== questionId),
  })),
  
  setExamResults: (results) => set({ examResults: results }),
  
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  
  setIsExamMode: (mode) => set({ isExamMode: mode }),
  
  setExamTimeRemaining: (time) => set({ examTimeRemaining: time }),
  
  setSelectedChapter: (chapterId) => set({ selectedChapter: chapterId }),
  
  setSelectedMaterial: (materialId) => set({ selectedMaterial: materialId }),
  
  toggleFavorite: (id) => set((state) => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter((f) => f !== id)
      : [...state.favorites, id],
  })),
  
  setShowLoginModal: (show) => set({ showLoginModal: show }),
}));
