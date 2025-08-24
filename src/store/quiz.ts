import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Quiz } from '@/lib/types';
import { sampleQuizzes } from '@/data/sample-questions';

interface QuizState {
  quizzes: Quiz[];
  getQuizById: (id: string) => Quiz | undefined;
  setQuizzes: (quizzes: Quiz[]) => void;
  submitTest: (quizId: string, score: number) => void;
  retakeTest: (quizId: string) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    immer((set, get) => ({
      quizzes: [],
      getQuizById: (id) => {
        return get().quizzes.find((q) => q.id === id);
      },
      setQuizzes: (quizzes) => {
        set({ quizzes });
      },
      submitTest: (quizId, score) => {
        set(state => {
            const quizIndex = state.quizzes.findIndex(q => q.id === quizId);
            if (quizIndex !== -1) {
                state.quizzes[quizIndex].lastResult = {
                    score,
                    timestamp: new Date().toISOString(),
                };
                state.quizzes[quizIndex].attempts = (state.quizzes[quizIndex].attempts || 0) + 1;
            }
        });
      },
      retakeTest: (quizId: string) => {
        set(state => {
            const quizIndex = state.quizzes.findIndex(q => q.id === quizId);
            if (quizIndex !== -1) {
                state.quizzes[quizIndex].lastResult = undefined;
            }
        });
      }
    })),
    {
      name: 'brainboost-quiz-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.quizzes.length === 0) {
          state.quizzes = sampleQuizzes;
        }
      },
    }
  )
);
