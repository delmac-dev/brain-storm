import type { Question, Answer } from './types';

export const isAnswerCorrect = (question: Question, userAnswer: Answer | null): boolean => {
  if (userAnswer === null) return false;

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
