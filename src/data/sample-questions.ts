
import type { Quiz } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const sampleQuizzes: Quiz[] = [
  {
    id: uuidv4(),
    title: "World Capitals",
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
      }
    ]
  },
  {
    id: uuidv4(),
    title: "Science Basics",
    questions: [
      {
        id: uuidv4(),
        question: "Which of the following are primary colors?",
        type: "multi-choice",
        options: [
          { key: "a", text: "Red" },
          { key: "b", text: "Green" },
          { key: "c", text: "Blue" },
          { key: "d", text: "Yellow" },
        ],
        answer: ["a", "c", "d"],
        explanation: "The primary colors in the RYB color model are red, yellow, and blue.",
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
        question: "Which of the following statements about planets are true?",
        type: "composite",
        compositeOptions: [
          "(i) Jupiter is the largest planet in our solar system.",
          "(ii) Mars is known as the Blue Planet.",
          "(iii) Saturn is the only planet with rings."
        ],
        options: [
          { key: "a", text: "Only (i) is correct." },
          { key: "b", text: "(i) and (ii) are correct." },
          { key: "c", text: "All statements are correct." },
          { key: "d", text: "None of the statements are correct." }
        ],
        answer: ["a"],
        explanation: "Only statement (i) is correct. Mars is the Red Planet, and other planets like Jupiter also have rings, though Saturn's are the most prominent.",
      },
    ]
  },
];
