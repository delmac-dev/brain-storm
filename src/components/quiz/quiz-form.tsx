"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const JsonEditor = dynamic(() => import('@/components/quiz/json-editor'), {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />,
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z.array(z.any()).min(1, "At least one question is required"),
});

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit: (data: Quiz) => void;
  isEdit?: boolean;
}

export function QuizForm({ quiz, onSubmit, isEdit = false }: QuizFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: quiz?.title || "",
            questions: quiz?.questions || [],
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
  }, [quiz, reset]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const validatedQuestions = z.array(z.object({
          id: z.string(),
          question: z.string(),
          type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
          explanation: z.string(),
          answer: z.any(),
      }).or(z.object({
          question: z.string(),
          type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
          explanation: z.string(),
          answer: z.any(),
      }))).parse(data.questions);
      
      const questionsWithIds = validatedQuestions.map(q => ({ ...q, id: 'id' in q ? q.id : uuidv4() }));

      onSubmit({
        id: quiz?.id || uuidv4(),
        title: data.title,
        questions: questionsWithIds as Question[],
      });

      toast({
          title: isEdit ? "Quiz Updated" : "Quiz Created",
          description: `The quiz "${data.title}" has been saved.`,
      })
      router.push('/');

    } catch (error) {
        toast({
            title: "Invalid Questions JSON",
            description: "The questions JSON is not correctly formatted. Please check the structure and try again.",
            variant: "destructive",
        })
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle>{isEdit ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
                <CardDescription>
                    {isEdit ? "Update the details for your quiz." : "Fill in the details for your new quiz."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
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
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isEdit ? 'Update Quiz' : 'Create Quiz'}
                </Button>
            </CardFooter>
        </Card>
    </form>
  );
}
