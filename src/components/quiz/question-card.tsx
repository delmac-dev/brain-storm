"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, CheckCircle, Clock, Percent, Repeat } from "lucide-react";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
    const retakeTest = useQuizStore((state) => state.retakeTest);
    const { toast } = useToast();

    const handleRetake = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        retakeTest(question.id);
        toast({
            title: "Test Reset",
            description: `You can now retake the test for "${question.question}"`,
        })
    }
    
  const difficultyMap: Record<string, "default" | "secondary" | "destructive"> = {
    easy: "default",
    medium: "secondary",
    hard: "destructive",
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="h-full"
    >
      <Link href={`/test/${question.id}`} className="h-full block">
        <Card className="flex h-full flex-col transition-all duration-300 hover:border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg leading-tight pr-4">{question.question}</CardTitle>
              {question.difficulty && (
                <Badge variant={difficultyMap[question.difficulty]}>
                  {question.difficulty}
                </Badge>
              )}
            </div>
            {question.tags && question.tags.length > 0 && (
              <CardDescription className="pt-2">
                {question.tags.join(', ')}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            {question.lastResult ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Percent className="mr-2 h-4 w-4" />
                  <span>Last Score: {question.lastResult.score}%</span>
                  {question.lastResult.score === 100 && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{new Date(question.lastResult.timestamp).toLocaleString()}</span>
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
            {question.lastResult && (
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
