export interface Option {
  key: string;
  text: string;
}

export interface CompositeStatement {
  id: string;
  text: string;
}

export interface CompositeChoice {
  key: string;
  text: string;
}

export interface CompositeOptions {
  statements: CompositeStatement[];
  choices: CompositeChoice[];
}

export type Answer = string | string[] | boolean | Record<string, string>;

export interface Question {
  id: string;
  question: string;
  type: "single-choice" | "multi-choice" | "composite" | "true-false";
  options?: Option[];
  compositeOptions?: CompositeOptions;
  answer: Answer;
  explanation: string;
  lastResult?: { score: number; timestamp: string; durationSeconds?: number };
  attempts?: number;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
}
