"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, CheckCircle, Clock, Percent, Repeat, FileJson, MoreVertical, Edit, Trash2 } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useQuizStore } from "@/store/quiz";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuizCard({ quiz, onEdit, onDelete }: QuizCardProps) {
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
    
    const handleDropdownSelect = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation();}}>
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={handleDropdownSelect}>
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent onClick={(e) => { e.preventDefault(); e.stopPropagation();}}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the quiz
                      "{quiz.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
