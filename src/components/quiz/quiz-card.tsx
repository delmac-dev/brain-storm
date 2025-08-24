"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, CheckCircle, Clock, Percent, Repeat, FileJson } from "lucide-react";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuizStore } from "@/store/quiz";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
    const retakeTest = useQuizStore((state) => state.retakeTest);
    const { toast } = useToast();

    const handleRetake = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        retakeTest(quiz.id);
        toast({
            title: "Test Reset",
            description: `You can now retake the test for "${quiz.title}"`,
        })
    }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="h-full"
    >
      <Link href={`/test/${quiz.id}`} className="h-full block">
        <Card className="flex h-full flex-col transition-all duration-300 hover:border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg leading-tight pr-4">{quiz.title}</CardTitle>
            </div>
            <CardDescription className="pt-2 flex items-center text-xs text-muted-foreground">
              <FileJson className="mr-2 h-3 w-3" />
              {quiz.questions.length} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {quiz.lastResult ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Percent className="mr-2 h-4 w-4" />
                  <span>Last Score: {quiz.lastResult.score}%</span>
                  {quiz.lastResult.score === 100 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{new Date(quiz.lastResult.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Not attempted yet.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button size="sm" asChild>
                <div className="flex items-center">
                    <Brain className="mr-2 h-4 w-4"/> Start Test
                </div>
            </Button>
            {quiz.lastResult && (
              <Button size="sm" variant="outline" onClick={handleRetake}>
                <Repeat className="mr-2 h-4 w-4" /> Retake
              </Button>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
