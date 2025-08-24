"use client";

import dynamic from "next/dynamic";
import { useQuizStore } from "@/store/quiz";
import { Skeleton } from "@/components/ui/skeleton";

const JsonEditor = dynamic(() => import('@/components/quiz/json-editor'), {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
});

export default function EditorPage() {
    const { quizzes, setQuizzes } = useQuizStore();

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Quiz Editor
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Add, edit, and delete quizzes and questions directly using JSON.
                </p>
            </div>
            <JsonEditor
                data={quizzes}
                onEdit={(edit) => {
                    setQuizzes(edit.updated_src);
                }}
                onAdd={(add) => {
                    setQuizzes(add.updated_src);
                }}
                onDelete={(del) => {
                    setQuizzes(del.updated_src);
                }}
            />
        </div>
    );
}
