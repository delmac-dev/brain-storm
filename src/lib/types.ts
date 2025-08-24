
export interface Option {
  key: string;
  text: string;
}

export type Answer = string | string[] | boolean;

export interface Question {
  id: string;
  question: string;
  type: "single-choice" | "multi-choice" | "composite" | "true-false";
  options?: Option[];
  compositeOptions?: string[];
  answer: Answer;
  explanation: string;
}

export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    lastResult?: { score: number; timestamp: string };
    attempts?: number;
}
