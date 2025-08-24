
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, ChevronRight, Check } from "lucide-react";

import type { Answer, Question, Quiz } from "@/lib/types";
import { useQuizStore } from "@/store/quiz";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { isAnswerCorrect } from "@/lib/quiz-helpers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface TestRunnerProps {
  quiz: Quiz;
}

export function TestRunner({ quiz }: TestRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { submitTest } = useQuizStore();
  const { toast } = useToast();
  const router = useRouter();

  const question = quiz.questions[currentQuestionIndex];

  const handleSingleChoiceChange = (value: string) => setSelectedAnswer(value);
  const handleMultiChoiceChange = (key: string) => {
    const currentAnswer = (selectedAnswer as string[] | null) || [];
    const newAnswer = currentAnswer.includes(key)
      ? currentAnswer.filter((k) => k !== key)
      : [...currentAnswer, key];
    setSelectedAnswer(newAnswer);
  };
  const handleTrueFalseChange = (value: boolean) => setSelectedAnswer(value);

  const handleSubmit = () => {
    if (selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (isAnswerCorrect(question, selectedAnswer)) {
        setCorrectAnswers(correctAnswers + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
      submitTest(quiz.id, finalScore);
      setIsFinished(true);
    }
  };

  const renderOptions = () => {
    switch (question.type) {
      case "single-choice":
        return (
          <RadioGroup onValueChange={handleSingleChoiceChange} disabled={isSubmitted} className="space-y-3">
            {question.options?.map((option) => (
              <Label key={option.key} className={cn("flex items-center space-x-3 rounded-md border p-4 transition-all", isSubmitted && (question.answer === option.key ? 'border-green-500 bg-green-500/10' : selectedAnswer === option.key ? 'border-red-500 bg-red-500/10' : ''))}>
                <RadioGroupItem value={option.key} />
                <span>{option.text}</span>
              </Label>
            ))}
          </RadioGroup>
        );
      case "multi-choice":
      case "composite":
        return (
          <div className="space-y-3">
            {question.type === 'composite' && (
              <div className="space-y-2 rounded-md bg-muted p-4 mb-4">
                {question.compositeOptions?.map((statement, index) => (
                  <p key={index} className="text-muted-foreground">{statement}</p>
                ))}
              </div>
            )}
            {question.options?.map((option) => (
              <Label key={option.key} className={cn("flex items-center space-x-3 rounded-md border p-4 transition-all", isSubmitted && ((question.answer as string[]).includes(option.key) ? 'border-green-500 bg-green-500/10' : (selectedAnswer as string[] | null)?.includes(option.key) ? 'border-red-500 bg-red-500/10' : ''))}>
                <Checkbox
                  value={option.key}
                  checked={(selectedAnswer as string[] | null)?.includes(option.key)}
                  onCheckedChange={() => handleMultiChoiceChange(option.key)}
                  disabled={isSubmitted}
                />
                <span>{option.text}</span>
              </Label>
            ))}
          </div>
        );
      case "true-false":
        return (
          <RadioGroup onValueChange={(v) => handleTrueFalseChange(v === 'true')} disabled={isSubmitted} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[true, false].map((value) => (
                <Label key={String(value)} className={cn("flex items-center space-x-3 rounded-md border p-4 transition-all", selectedAnswer === value && 'ring-2 ring-primary', isSubmitted && (question.answer === value ? 'border-green-500 bg-green-500/10' : selectedAnswer === value ? 'border-red-500 bg-red-500/10' : ''))}>
                  <RadioGroupItem value={String(value)} />
                  <span>{String(value)}</span>
                </Label>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };
  
  const isSubmitDisabled = useMemo(() => {
    if (isSubmitted) return true;
    return selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0);
  }, [selectedAnswer, isSubmitted, question]);

  if (isFinished) {
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Test Complete!</CardTitle>
                <CardDescription>You have completed the {quiz.title} test.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-lg">Your score:</p>
                <p className="text-6xl font-bold text-primary my-4">{finalScore}%</p>
                <p className="text-muted-foreground">{correctAnswers} out of {quiz.questions.length} correct</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
                    Back to Quizzes <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{quiz.title}</CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </CardDescription>
        <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        <p className="mb-6 font-semibold text-lg">{question.question}</p>
        {renderOptions()}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Alert variant={isAnswerCorrect(question, selectedAnswer) ? "default" : "destructive"} className={cn(isAnswerCorrect(question, selectedAnswer) ? "border-green-500 text-green-700 dark:text-green-400" : "border-red-500")}>
              {isAnswerCorrect(question, selectedAnswer) ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{isAnswerCorrect(question, selectedAnswer) ? "Correct!" : "Incorrect"}</AlertTitle>
              <AlertDescription className="mt-4 flex items-start">
                <Lightbulb className="mr-2 h-4 w-4 flex-shrink-0 mt-1" />
                <span><span className="font-semibold">Explanation:</span> {question.explanation}</span>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full sm:w-auto">
            Submit Answer <Check className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full sm:w-auto">
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Test'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
