"use client";

import { QuestionListEditor } from "@/components/quiz/question-list-editor";

export default function EditorPage() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Question Editor
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Create, update, and delete questions for your quizzes.
                </p>
            </div>
            <QuestionListEditor />
        </div>
    );
}
