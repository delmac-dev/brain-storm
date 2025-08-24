
"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import type EditorType from "monaco-editor";

import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z.string().min(1, "At least one question is required"),
});

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit: (data: Quiz) => void;
  isEdit?: boolean;
}

export function QuizForm({ quiz, onSubmit, isEdit = false }: QuizFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const editorRef = useRef<EditorType.editor.IStandaloneCodeEditor | null>(null);

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
            questions: quiz?.questions ? JSON.stringify(quiz.questions, null, 2) : "[]",
        },
    });

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title,
        questions: JSON.stringify(quiz.questions, null, 2),
      });
    } else {
      reset({
        title: "",
        questions: "[]",
      });
    }
  }, [quiz, reset]);

  const handleEditorDidMount = (editor: EditorType.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 200);
  };
  
  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const questionsParsed = JSON.parse(data.questions);

      const validatedQuestions = z.array(z.object({
          id: z.string().optional(),
          question: z.string(),
          type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
          explanation: z.string(),
          answer: z.any(),
          options: z.array(z.any()).optional(),
          compositeOptions: z.array(z.string()).optional(),
      })).parse(questionsParsed);
      
      const questionsWithIds = validatedQuestions.map(q => ({ ...q, id: q.id || uuidv4() }));

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
            description: "The questions JSON is not correctly formatted or invalid. Please check the structure and try again.",
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
                           <div className="rounded-lg border overflow-hidden">
                             <MonacoEditor
                                height="400px"
                                language="json"
                                theme="vs-light"
                                value={field.value}
                                options={{
                                    automaticLayout: true,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    minimap: { enabled: false },
                                    tabSize: 2,
                                    insertSpaces: true,
                                }}
                                onMount={handleEditorDidMount}
                                onChange={(value) => {
                                    setValue('questions', value || "");
                                    setTimeout(() => {
                                      editorRef.current?.getAction('editor.action.formatDocument')?.run();
                                    }, 100);
                                }}
                            />
                           </div>
                        )}
                    />
                    {errors.questions && <p className="text-sm text-red-500 mt-1">{errors.questions.message as string}</p>}
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
