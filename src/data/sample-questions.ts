
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
        question: "The Amazon River is the longest river in the world.",
        type: "true-false",
        answer: false,
        explanation: "Recent studies suggest the Amazon is longer than the Nile, but traditionally the Nile was considered longest. For this quiz, we consider it false as it's a point of contention and a common misconception.",
      },
      {
        id: uuidv4(),
        question: "Which of these countries are in South America?",
        type: "multi-choice",
        options: [
            { key: "a", text: "Brazil" },
            { key: "b", text: "Spain" },
            { key: "c", text: "Argentina" },
            { key: "d", text: "Mexico" },
        ],
        answer: ["a", "c"],
        explanation: "Brazil and Argentina are in South America. Spain is in Europe and Mexico is in North America.",
      },
      {
        id: uuidv4(),
        question: "Which statement about Mount Everest is correct?",
        type: "composite",
        compositeOptions: [
          "(i) It is located in the Himalayas.",
          "(ii) It is the tallest mountain in the world.",
          "(iii) It is on the border of China and Nepal."
        ],
        options: [
            { key: "a", text: "Only (i) is correct" },
            { key: "b", text: "(i) and (ii) are correct" },
            { key: "c", text: "All statements are correct" }
        ],
        answer: "c",
        explanation: "All statements are correct. Mount Everest is the world's highest mountain above sea level, located in the Mahalangur Himal sub-range of the Himalayas. The international border between China and Nepal runs across its summit point.",
      }
    ]
  },
  {
    id: uuidv4(),
    title: "Science & Nature",
    questions: [
      {
        id: uuidv4(),
        question: "What is the chemical symbol for water?",
        type: "single-choice",
        options: [
            { key: "a", text: "O2" },
            { key: "b", text: "H2O" },
            { key: "c", text: "CO2" },
            { key: "d", text: "NaCl" },
        ],
        answer: "b",
        explanation: "H2O is the chemical formula for water, indicating that one molecule of water is composed of two hydrogen atoms and one oxygen atom.",
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
        question: "Which of the following are planets in our Solar System?",
        type: "multi-choice",
        options: [
          { key: "a", text: "Jupiter" },
          { key: "b", text: "Proxima Centauri" },
          { key: "c", text: "Mars" },
          { key: "d", text: "Andromeda" },
        ],
        answer: ["a", "c"],
        explanation: "Jupiter and Mars are planets in our Solar System. Proxima Centauri is a star, and Andromeda is a galaxy.",
      },
      {
        id: uuidv4(),
        question: "Consider the following statements about photosynthesis.",
        type: "composite",
        compositeOptions: [
          "(i) It is the process by which plants make their food.",
          "(ii) It requires sunlight, water, and carbon dioxide.",
          "(iii) It produces oxygen as a byproduct."
        ],
        options: [
          { key: "a", text: "Only (i) and (iii) are correct." },
          { key: "b", text: "Only (i) and (ii) are correct." },
          { key: "c", text: "All statements are correct." },
          { key: "d", text: "None of the statements are correct." }
        ],
        answer: "c",
        explanation: "Photosynthesis is the process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy. It requires sunlight, water, and carbon dioxide, and produces oxygen.",
      },
    ]
  },
];
