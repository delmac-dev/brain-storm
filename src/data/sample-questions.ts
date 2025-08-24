import type { Question } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const sampleQuestions: Question[] = [
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
    difficulty: "easy",
    tags: ["geography"],
  },
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
    difficulty: "easy",
    tags: ["art", "color theory"],
  },
  {
    id: uuidv4(),
    question: "The chemical symbol for gold is Au.",
    type: "true-false",
    answer: true,
    explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
    difficulty: "medium",
    tags: ["chemistry", "science"],
  },
  {
    id: uuidv4(),
    question: "Match the planets to their description.",
    type: "composite",
    compositeOptions: {
      statements: [
        { id: "s1", text: "The largest planet in our solar system." },
        { id: "s2", text: "Known as the Red Planet." },
        { id: "s3", text: "Has prominent rings." },
      ],
      choices: [
        { key: "c1", text: "Mars" },
        { key: "c2", text: "Jupiter" },
        { key: "c3", text: "Saturn" },
      ],
    },
    answer: {
      s1: "c2",
      s2: "c1",
      s3: "c3",
    },
    explanation: "Jupiter is the largest planet, Mars is the Red Planet, and Saturn is famous for its rings.",
    difficulty: "hard",
    tags: ["astronomy", "science"],
  },
  {
    id: uuidv4(),
    question: "What is 2 + 2?",
    type: "single-choice",
    options: [
      { key: "a", text: "3" },
      { key: "b", text: "4" },
      { key: "c", text: "5" },
      { key: "d", text: "6" },
    ],
    answer: "b",
    explanation: "Basic arithmetic: 2 + 2 equals 4.",
    difficulty: "easy",
    tags: ["math"],
  },
  {
    id: uuidv4(),
    question: "The Pacific Ocean is the largest ocean on Earth.",
    type: "true-false",
    answer: true,
    explanation: "The Pacific Ocean covers about one-third of the surface of the Earth.",
    difficulty: "easy",
    tags: ["geography"],
  },
];
