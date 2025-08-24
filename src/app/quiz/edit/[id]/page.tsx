"use client";

import { useParams, useRouter } from "next/navigation";
import { QuizForm } from "@/components/quiz/quiz-form";
import { useQuizStore } from "@/store/quiz";
import type { Quiz } from "@/lib/types";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function EditQuizPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const { getQuizById, updateQuiz } = useQuizStore();
    const quiz = getQuizById(id);
    const hasMounted = useHasMounted();

    const handleSubmit = (data: Quiz) => {
        updateQuiz(data);
    };

    if (!hasMounted) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!quiz) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold">Quiz Not Found</h1>
                <p className="mt-2 text-muted-foreground">The quiz you are looking for does not exist.</p>
                <Button asChild className="mt-6">
                    <Link href="/">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Quizzes
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <QuizForm quiz={quiz} onSubmit={handleSubmit} isEdit={true} />
        </div>
    );
}
