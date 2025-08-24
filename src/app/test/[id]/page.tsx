"use client";

import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TestRunner } from "@/components/quiz/test-runner";
import { useQuizStore } from "@/store/quiz";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const question = useQuizStore((state) => state.getQuestionById(id));
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/4 mb-8" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold">Question Not Found</h1>
        <p className="mt-2 text-muted-foreground">The question you are looking for does not exist.</p>
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
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <TestRunner question={question} />
    </div>
  );
}
