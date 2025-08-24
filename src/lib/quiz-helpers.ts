
import type { Question, Answer } from './types';

export const isAnswerCorrect = (question: Question, userAnswer: Answer | null): boolean => {
  if (userAnswer === null) return false;

  if (question.type === 'single-choice' || question.type === 'true-false' || question.type === 'composite') {
    return question.answer === userAnswer;
  }
  if (question.type === 'multi-choice') {
    if (!Array.isArray(question.answer) || !Array.isArray(userAnswer)) return false;
    if (question.answer.length !== userAnswer.length) return false;
    const sortedCorrectAnswer = [...question.answer].sort();
    const sortedUserAnswer = [...userAnswer].sort();
    return sortedCorrectAnswer.every((val, index) => val === sortedUserAnswer[index]);
  }
  return false;
};
