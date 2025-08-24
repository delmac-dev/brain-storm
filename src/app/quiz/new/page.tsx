"use client";

import { QuizForm } from "@/components/quiz/quiz-form";
import { useQuizStore } from "@/store/quiz";
import type { Quiz } from "@/lib/types";

export default function NewQuizPage() {
    const addQuiz = useQuizStore((state) => state.addQuiz);

    const handleSubmit = (data: Quiz) => {
        addQuiz(data);
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <QuizForm onSubmit={handleSubmit} isEdit={false} />
        </div>
    );
}
