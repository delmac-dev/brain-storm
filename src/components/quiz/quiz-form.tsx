"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";

import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const JsonEditor = dynamic(() => import('@/components/quiz/json-editor'), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />,
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z.array(z.any()).min(1, "At least one question is required"),
});

interface QuizFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  quiz?: Quiz | null;
  onSubmit: (data: Quiz) => void;
}

export function QuizForm({ isOpen, setIsOpen, quiz, onSubmit }: QuizFormProps) {
    const { toast } = useToast();
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            questions: [],
        },
    });

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title,
        questions: quiz.questions,
      });
    } else {
      reset({
        title: "",
        questions: [],
      });
    }
  }, [quiz, reset, isOpen]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const validatedQuestions = z.array(z.object({
          id: z.string(),
          question: z.string(),
          type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
          explanation: z.string(),
          answer: z.any(),
      })).parse(data.questions);
      
      onSubmit({
        id: quiz?.id || uuidv4(),
        title: data.title,
        questions: validatedQuestions as Question[],
      });
      setIsOpen(false);
      toast({
          title: quiz ? "Quiz Updated" : "Quiz Created",
          description: `The quiz "${data.title}" has been saved.`,
      })
    } catch (error) {
        toast({
            title: "Invalid Questions JSON",
            description: "The questions JSON is not correctly formatted. Please check the structure and try again.",
            variant: "destructive",
        })
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
          <DialogDescription>
            {quiz ? "Update the details for your quiz." : "Fill in the details for your new quiz."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Questions (JSON)</Label>
            <Controller
                name="questions"
                control={control}
                render={({ field }) => (
                    <JsonEditor
                        data={field.value}
                        onEdit={(edit) => setValue('questions', edit.updated_src as Question[])}
                        onAdd={(add) => setValue('questions', add.updated_src as Question[])}
                        onDelete={(del) => setValue('questions', del.updated_src as Question[])}
                    />
                )}
            />
            {errors.questions && <p className="text-sm text-red-500 mt-1">{errors.questions.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Quiz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
