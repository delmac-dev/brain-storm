
import type { Quiz } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const sampleQuizzes: Quiz[] = [
  {
    id: uuidv4(),
    title: "World Capitals & Geography",
    questions: [
      {
        id: uuidv4(),
        question: "What is the capital of France?",
        type: "single-choice",
        options: [
          { key: "a", text: "Berlin" },
          { key: "b", text: "Madrid" },
          { key: "c", text: "Paris" },
          { key: "d", text: "Rome" },
        ],
        answer: "c",
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        id: uuidv4(),
        question: "What is the capital of Japan?",
        type: "single-choice",
        options: [
          { key: "a", text: "Beijing" },
          { key: "b", text: "Seoul" },
          { key: "c", text: "Tokyo" },
          { key: "d", text: "Bangkok" },
        ],
        answer: "c",
        explanation: "Tokyo is the capital and largest city of Japan.",
      },
      {
        id: uuidv4(),
        question: "The Nile River is the longest river in the world.",
        type: "true-false",
        answer: true,
        explanation: "The Nile River, flowing northward through northeastern Africa, is traditionally considered the longest river in the world.",
      },
    ]
  },
  {
    id: uuidv4(),
    title: "Science & Nature",
    questions: [
      {
        id: uuidv4(),
        question: "Which of the following are primary colors in the RYB color model?",
        type: "multi-choice",
        options: [
          { key: "a", text: "Red" },
          { key: "b", text: "Green" },
          { key: "c", text: "Blue" },
          { key: "d", text: "Yellow" },
        ],
        answer: ["a", "c", "d"],
        explanation: "The primary colors in the RYB (Red, Yellow, Blue) color model are red, yellow, and blue.",
      },
      {
        id: uuidv4(),
        question: "The chemical symbol for gold is Au.",
        type: "true-false",
        answer: true,
        explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
      },
      {
        id: uuidv4(),
        question: "Which of the following statements about our solar system are true?",
        type: "composite",
        compositeOptions: [
          "(i) Jupiter is the largest planet.",
          "(ii) Mars is known as the Red Planet.",
          "(iii) Venus is the closest planet to the Sun."
        ],
        options: [
          { key: "a", text: "Only (i) is correct." },
          { key: "b", text: "(i) and (ii) are correct." },
          { key: "c", text: "All statements are correct." },
          { key: "d", text: "None of the statements are correct." }
        ],
        answer: ["b"],
        explanation: "Statements (i) and (ii) are correct. Jupiter is the largest planet and Mars is called the Red Planet. Venus is the second planet from the Sun; Mercury is the closest.",
      },
    ]
  },
];
