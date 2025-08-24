import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { Question, Answer } from '@/lib/types';
import { sampleQuestions } from '@/data/sample-questions';

interface QuizState {
  questions: Question[];
  getQuestionById: (id: string) => Question | undefined;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updatedQuestion: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  submitAnswer: (questionId: string, userAnswer: Answer, duration: number) => boolean;
  retakeTest: (questionId: string) => void;
}

const isAnswerCorrect = (question: Question, userAnswer: Answer): boolean => {
  if (question.type === 'single-choice' || question.type === 'true-false') {
    return question.answer === userAnswer;
  }
  if (question.type === 'multi-choice') {
    if (!Array.isArray(question.answer) || !Array.isArray(userAnswer)) return false;
    if (question.answer.length !== userAnswer.length) return false;
    const sortedCorrectAnswer = [...question.answer].sort();
    const sortedUserAnswer = [...userAnswer].sort();
    return sortedCorrectAnswer.every((val, index) => val === sortedUserAnswer[index]);
  }
  if (question.type === 'composite') {
    if (typeof question.answer !== 'object' || typeof userAnswer !== 'object' || userAnswer === null) return false;
    const correctAnswer = question.answer as Record<string, string>;
    const userAnswerRecord = userAnswer as Record<string, string>;
    const keys = Object.keys(correctAnswer);
    if (keys.length !== Object.keys(userAnswerRecord).length) return false;
    return keys.every(key => correctAnswer[key] === userAnswerRecord[key]);
  }
  return false;
};

export const useQuizStore = create<QuizState>()(
  persist(
    immer((set, get) => ({
      questions: [],
      getQuestionById: (id) => {
        return get().questions.find((q) => q.id === id);
      },
      addQuestion: (question) => {
        set((state) => {
          state.questions.push({ ...question, id: uuidv4() });
        });
      },
      updateQuestion: (id, updatedQuestion) => {
        set((state) => {
          const questionIndex = state.questions.findIndex((q) => q.id === id);
          if (questionIndex !== -1) {
            state.questions[questionIndex] = { ...state.questions[questionIndex], ...updatedQuestion };
          }
        });
      },
      deleteQuestion: (id) => {
        set((state) => {
          state.questions = state.questions.filter((q) => q.id !== id);
        });
      },
      submitAnswer: (questionId, userAnswer, duration) => {
        const question = get().getQuestionById(questionId);
        if (!question) return false;

        const correct = isAnswerCorrect(question, userAnswer);
        const score = correct ? 100 : 0;

        get().updateQuestion(questionId, {
          lastResult: {
            score,
            timestamp: new Date().toISOString(),
            durationSeconds: duration,
          },
          attempts: (question.attempts || 0) + 1,
        });
        return correct;
      },
      retakeTest: (questionId: string) => {
        get().updateQuestion(questionId, {
            lastResult: undefined,
        });
      }
    })),
    {
      name: 'brainboost-quiz-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.questions.length === 0) {
          state.questions = sampleQuestions;
        }
      },
    }
  )
);
