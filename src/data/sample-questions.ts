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
      },
    ]
  },
];
