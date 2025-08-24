"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, ChevronRight, Check } from "lucide-react";

import type { Answer, Question, Option as OptionType, CompositeStatement, CompositeChoice } from "@/lib/types";
import { useQuizStore } from "@/store/quiz";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestRunnerProps {
  question: Question;
}

export function TestRunner({ question }: TestRunnerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());

  const submitAnswer = useQuizStore((state) => state.submitAnswer);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [question.id]);

  const handleSingleChoiceChange = (value: string) => setSelectedAnswer(value);
  const handleMultiChoiceChange = (key: string) => {
    const currentAnswer = (selectedAnswer as string[] | null) || [];
    const newAnswer = currentAnswer.includes(key)
      ? currentAnswer.filter((k) => k !== key)
      : [...currentAnswer, key];
    setSelectedAnswer(newAnswer);
  };
  const handleTrueFalseChange = (value: boolean) => setSelectedAnswer(value);
  const handleCompositeChange = (statementId: string, choiceKey: string) => {
      const currentAnswer = (selectedAnswer as Record<string, string> | null) || {};
      setSelectedAnswer({ ...currentAnswer, [statementId]: choiceKey });
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    const correct = submitAnswer(question.id, selectedAnswer, duration);
    setIsCorrect(correct);
    setIsSubmitted(true);
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
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <Label key={option.key} className={cn("flex items-center space-x-3 rounded-md border p-4 transition-all", isSubmitted && ((question.answer as string[]).includes(option.key) ? 'border-green-500 bg-green-500/10' : (selectedAnswer as string[]).includes(option.key) ? 'border-red-500 bg-red-500/10' : ''))}>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[true, false].map((value) => (
                <Button key={String(value)} variant="outline" size="lg" onClick={() => handleTrueFalseChange(value)} disabled={isSubmitted} className={cn("h-auto py-4 text-base", selectedAnswer === value && 'ring-2 ring-primary', isSubmitted && (question.answer === value ? 'border-green-500 bg-green-500/10' : selectedAnswer === value ? 'border-red-500 bg-red-500/10' : ''))}>
                    {String(value)}
                </Button>
            ))}
          </div>
        );
      case "composite":
        return (
            <div className="space-y-4">
                {question.compositeOptions?.statements.map((statement) => (
                    <div key={statement.id} className={cn("rounded-md border p-4", isSubmitted && ((question.answer as Record<string, string>)[statement.id] === (selectedAnswer as Record<string, string>)?.[statement.id] ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'))}>
                        <p className="mb-2 font-medium">{statement.text}</p>
                        <Select onValueChange={(value) => handleCompositeChange(statement.id, value)} disabled={isSubmitted}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a match..." />
                            </SelectTrigger>
                            <SelectContent>
                                {question.compositeOptions?.choices.map((choice) => (
                                    <SelectItem key={choice.key} value={choice.key}>{choice.text}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
        )
      default:
        return null;
    }
  };
  
  const isSubmitDisabled = useMemo(() => {
    if (isSubmitted) return true;
    if (question.type === 'composite') {
        const selectedCount = Object.keys(selectedAnswer || {}).length;
        const requiredCount = question.compositeOptions?.statements.length || 0;
        return selectedCount !== requiredCount;
    }
    return selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0);
  }, [selectedAnswer, isSubmitted, question]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{question.question}</CardTitle>
        <CardDescription>
          Attempts: {question.attempts || 0}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderOptions()}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Alert variant={isCorrect ? "default" : "destructive"} className={cn(isCorrect ? "border-green-500 text-green-700 dark:text-green-400" : "border-red-500")}>
              {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
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
          <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
            Back to Quizzes <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
