"use client";

import { motion } from "framer-motion";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/quiz/question-card";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useQuizStore } from "@/store/quiz";
import { Skeleton } from "@/components/ui/skeleton";
import { FileQuestion } from "lucide-react";

export default function Home() {
  const questions = useQuizStore((state) => state.questions);
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
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Welcome to BrainBoost
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select a quiz to test your knowledge or visit the editor to create new questions.
        </p>
      </motion.div>

      {!hasMounted ? (
        renderSkeletons()
      ) : questions.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questions.map((question) => (
            <motion.div key={question.id} variants={itemVariants}>
              <QuestionCard question={question} />
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
            No questions yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new question.
          </p>
          <Button asChild className="mt-6">
            <Link href="/editor">Create Question</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
