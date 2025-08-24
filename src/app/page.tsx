"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import { PlusCircle, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz/quiz-card";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useQuizStore } from "@/store/quiz";
import { Skeleton } from "@/components/ui/skeleton";
import type { Quiz } from "@/lib/types";

export default function Home() {
  const { quizzes, deleteQuiz } = useQuizStore();
  const hasMounted = useHasMounted();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz(quizId);
  }

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Your Quizzes
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select a quiz to test your knowledge or create a new one.
          </p>
        </div>
        <Button asChild>
            <Link href="/quiz/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Quiz
            </Link>
        </Button>
      </motion.div>

      {!hasMounted ? (
        renderSkeletons()
      ) : quizzes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quizzes.map((quiz) => (
            <motion.div key={quiz.id} variants={itemVariants}>
              <QuizCard 
                quiz={quiz} 
                onDelete={() => handleDeleteQuiz(quiz.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center"
        >
          <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No quizzes yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new quiz.
          </p>
          <Button asChild className="mt-6">
            <Link href="/quiz/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quiz
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
