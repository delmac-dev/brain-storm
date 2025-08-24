
"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import type EditorType from "monaco-editor";
import { HelpCircle, Copy } from "lucide-react";

import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full" />,
});

const optionSchema = z.object({
    key: z.string(),
    text: z.string(),
});

const questionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1, "Question text cannot be empty"),
  type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
  explanation: z.string().min(1, "Explanation cannot be empty"),
  answer: z.any(),
  options: z.array(optionSchema).optional(),
  compositeOptions: z.array(z.string()).optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
      return false;
    }
  }, { message: "Questions must be a non-empty JSON array." }).refine((val) => {
    try {
        const parsed = JSON.parse(val);
        z.array(questionSchema).parse(parsed);
        return true;
    } catch (e) {
        if (e instanceof z.ZodError) {
            console.error(e.errors);
        }
        return false;
    }
  }, { message: "The questions JSON structure is invalid. Check the help section for the correct format." }),
});

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit: (data: Quiz) => void;
  isEdit?: boolean;
}

const sampleJsonStructure = `
[
  {
    "id": "auto-generated-uuid",
    "question": "What is the capital of France?",
    "type": "single-choice",
    "options": [
      { "key": "a", "text": "Berlin" },
      { "key": "b", "text": "Madrid" },
      { "key": "c", "text": "Paris" },
      { "key": "d", "text": "Rome" }
    ],
    "answer": "c",
    "explanation": "Paris is the capital of France."
  },
  {
    "id": "auto-generated-uuid",
    "question": "Which of these are primary colors?",
    "type": "multi-choice",
    "options": [
      { "key": "a", "text": "Red" },
      { "key": "b", "text": "Green" },
      { "key": "c", "text": "Blue" }
    ],
    "answer": ["a", "c"],
    "explanation": "Red and Blue are primary colors."
  },
  {
    "id": "auto-generated-uuid",
    "question": "The sky is blue.",
    "type": "true-false",
    "answer": true,
    "explanation": "The sky appears blue due to Rayleigh scattering."
  },
  {
    "id": "auto-generated-uuid",
    "question": "Which statements are correct?",
    "type": "composite",
    "compositeOptions": [
      "(i) The sun is a star.",
      "(ii) The earth is flat."
    ],
    "options": [
      { "key": "a", "text": "Only (i)" },
      { "key": "b", "text": "Only (ii)" },
      { "key": "c", "text": "Both are correct" }
    ],
    "answer": ["a"],
    "explanation": "The sun is a star, but the Earth is spherical."
  }
]
`;

const aiPrompt = `
You are an expert in creating educational materials. Your task is to convert the questions from the attached file into a valid JSON format that follows a specific schema.

For each question, you must provide:
1. A unique "id" (you can use a placeholder like "uuid-1", "uuid-2").
2. The "question" text.
3. The "type" of the question. Supported types are "single-choice", "multi-choice", "true-false", and "composite".
4. An "options" array for "single-choice", "multi-choice", and "composite" types. Each option must have a "key" and a "text".
5. A "compositeOptions" array of strings for "composite" questions, containing the statements to be evaluated.
6. The correct "answer". This should be the option key(s) or a boolean for true/false.
7. A concise "explanation" for why the answer is correct.

Analyze the questions in the provided file and generate a JSON array of question objects that strictly adheres to this structure. Ensure the JSON is valid.
`;

function CodeBlock({ code }: { code: string }) {
    const { toast } = useToast();
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast({ title: "Copied to clipboard!" });
    };

    return (
        <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{code.trim()}</code>
            </pre>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={handleCopy}
            >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy</span>
            </Button>
        </div>
    );
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

      const questionsWithIds = questionsParsed.map((q: any) => ({ ...q, id: q.id || uuidv4() }));

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

  const onInvalid = (errors: any) => {
    let errorMessage = "Please fix the errors in the form.";
    if (errors.title) {
        errorMessage = errors.title.message;
    } else if (errors.questions) {
        errorMessage = errors.questions.message;
    }
    toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)}>
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
                    <div className="flex items-center justify-between">
                        <Label>Questions (JSON)</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                                    <HelpCircle className="h-4 w-4" />
                                    Help
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>JSON Structure Help</DialogTitle>
                                    <DialogDescription>
                                        Use the tabs below to understand the required JSON format and how to generate it.
                                    </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="structure">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="structure">Structure</TabsTrigger>
                                        <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="structure">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Your JSON must be an array of question objects. Here is an example of the structure:
                                        </p>
                                        <CodeBlock code={sampleJsonStructure} />
                                    </TabsContent>
                                    <TabsContent value="usage">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Copy the prompt below and paste it into any AI tool that accepts file uploads (like a PDF of your questions). The AI will generate the JSON for you.
                                        </p>
                                        <CodeBlock code={aiPrompt} />
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                                    setValue('questions', value || "", { shouldValidate: true });
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

    