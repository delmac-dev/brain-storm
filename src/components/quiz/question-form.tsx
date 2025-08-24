"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import type { Question } from "@/lib/types";
import { useQuizStore } from "@/store/quiz";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const optionSchema = z.object({
  key: z.string(),
  text: z.string().min(1, "Option text cannot be empty"),
});

const compositeStatementSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Statement text cannot be empty"),
});

const compositeChoiceSchema = z.object({
  key: z.string(),
  text: z.string().min(1, "Choice text cannot be empty"),
});

const formSchema = z.object({
    question: z.string().min(1, "Question text is required"),
    type: z.enum(["single-choice", "multi-choice", "composite", "true-false"]),
    explanation: z.string().min(1, "Explanation is required"),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    tags: z.string().optional(),
    options: z.array(optionSchema).optional(),
    compositeOptions: z.object({
        statements: z.array(compositeStatementSchema),
        choices: z.array(compositeChoiceSchema),
    }).optional(),
    answer: z.any(),
})
.refine(data => {
    if (data.type === 'single-choice' || data.type === 'multi-choice') {
        return data.options && data.options.length >= 2;
    }
    return true;
}, { message: "Must have at least 2 options", path: ["options"] })
.refine(data => {
    if (data.type === 'composite') {
        return data.compositeOptions && data.compositeOptions.statements.length >= 1 && data.compositeOptions.choices.length >= 1;
    }
    return true;
}, { message: "Must have at least one statement and one choice", path: ["compositeOptions"] })
.refine(data => {
    if (data.type !== 'true-false' && !data.answer) {
        return false;
    }
    if(data.type === 'multi-choice' && Array.isArray(data.answer) && data.answer.length === 0) {
        return false;
    }
    return true;
}, { message: "An answer must be selected", path: ["answer"] });


interface QuestionFormProps {
  question?: Question | null;
  onFinished: () => void;
}

export function QuestionForm({ question, onFinished }: QuestionFormProps) {
  const { addQuestion, updateQuestion } = useQuizStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: question?.question || "",
      type: question?.type || "single-choice",
      explanation: question?.explanation || "",
      difficulty: question?.difficulty || "easy",
      tags: question?.tags?.join(", ") || "",
      options: question?.options || [{ key: uuidv4(), text: ""}, { key: uuidv4(), text: ""}],
      compositeOptions: question?.compositeOptions || { statements: [{id: uuidv4(), text: ''}], choices: [{key: uuidv4(), text: ''}]},
      answer: question?.answer,
    },
  });

  const { fields: options, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { fields: statements, append: appendStatement, remove: removeStatement } = useFieldArray({
    control: form.control,
    name: "compositeOptions.statements",
  });

  const { fields: choices, append: appendChoice, remove: removeChoice } = useFieldArray({
    control: form.control,
    name: "compositeOptions.choices",
  });

  const questionType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const questionData = {
        ...values,
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
    };

    if (question) {
      updateQuestion(question.id, questionData);
      toast({ title: "Question updated successfully" });
    } else {
      addQuestion(questionData);
      toast({ title: "Question added successfully" });
    }
    onFinished();
  }

  const renderAnswerSelection = () => {
    switch (questionType) {
        case "single-choice":
            return <FormField control={form.control} name="answer" render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            {form.getValues('options')?.map(opt => (
                                <FormItem key={opt.key} className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value={opt.key} /></FormControl>
                                    <FormLabel className="font-normal">{opt.text || "Option"}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />;
        case "multi-choice":
            return <FormItem>
                <FormLabel>Correct Answers</FormLabel>
                {form.getValues('options')?.map(opt => (
                    <FormField key={opt.key} control={form.control} name="answer" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(opt.key)}
                                    onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        return checked ? field.onChange([...current, opt.key]) : field.onChange(current.filter((v: string) => v !== opt.key));
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{opt.text || "Option"}</FormLabel>
                        </FormItem>
                    )} />
                ))}
                <FormMessage />
            </FormItem>;
        case "true-false":
            return <FormField control={form.control} name="answer" render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={(val) => field.onChange(val === 'true')} defaultValue={String(field.value)} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="true" /></FormControl><FormLabel className="font-normal">True</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="false" /></FormControl><FormLabel className="font-normal">False</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />;
        case "composite":
            return <FormItem>
                <FormLabel>Correct Answers</FormLabel>
                <div className="space-y-2">
                    {statements.map((statement, index) => (
                        <div key={statement.id} className="flex items-center gap-4">
                            <p className="flex-1 truncate">{statement.text || `Statement ${index+1}`}</p>
                            <FormField control={form.control} name={`answer.${statement.id}`} render={({field}) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="w-[180px]"><SelectValue placeholder="Select choice" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {choices.map(choice => (
                                            <SelectItem key={choice.key} value={choice.key}>{choice.text || "Choice"}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                    ))}
                </div>
                <FormMessage />
            </FormItem>

        default: return null;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="question" render={({ field }) => (
            <FormItem><FormLabel>Question</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem><FormLabel>Question Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="single-choice">Single Choice</SelectItem>
                        <SelectItem value="multi-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="composite">Composite</SelectItem>
                    </SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )} />

        { (questionType === "single-choice" || questionType === "multi-choice") && (
            <div className="space-y-4 rounded-md border p-4">
                <h4 className="font-medium">Options</h4>
                {options.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`options.${index}.text`} render={({ field: inputField }) => (
                        <FormItem><div className="flex items-center gap-2">
                            <FormControl><Input {...inputField} placeholder={`Option ${index+1}`} /></FormControl>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={options.length <= 2}><Trash2 className="h-4 w-4" /></Button>
                        </div><FormMessage /></FormItem>
                    )} />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendOption({ key: uuidv4(), text: ''})}><PlusCircle className="mr-2 h-4 w-4" />Add Option</Button>
            </div>
        )}

        { questionType === "composite" && (
            <div className="space-y-4 rounded-md border p-4">
                <h4 className="font-medium">Statements</h4>
                {statements.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`compositeOptions.statements.${index}.text`} render={({ field: inputField }) => (
                        <FormItem><div className="flex items-center gap-2">
                            <FormControl><Input {...inputField} placeholder={`Statement ${index+1}`} /></FormControl>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeStatement(index)} disabled={statements.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        </div><FormMessage /></FormItem>
                    )} />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendStatement({ id: uuidv4(), text: ''})}><PlusCircle className="mr-2 h-4 w-4" />Add Statement</Button>
                
                <h4 className="font-medium pt-4">Choices</h4>
                {choices.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`compositeOptions.choices.${index}.text`} render={({ field: inputField }) => (
                        <FormItem><div className="flex items-center gap-2">
                            <FormControl><Input {...inputField} placeholder={`Choice ${index+1}`} /></FormControl>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeChoice(index)} disabled={choices.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        </div><FormMessage /></FormItem>
                    )} />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendChoice({ key: uuidv4(), text: ''})}><PlusCircle className="mr-2 h-4 w-4" />Add Choice</Button>
            </div>
        )}

        <div className={cn("space-y-4 rounded-md border p-4", form.formState.errors.answer && "border-destructive")}>
            {renderAnswerSelection()}
        </div>
        <FormField control={form.control} name="explanation" render={({ field }) => (<FormItem><FormLabel>Explanation</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="difficulty" render={({ field }) => (<FormItem><FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
                </Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input {...field} placeholder="e.g. science, history" /></FormControl><FormDescription>Comma-separated list of tags.</FormDescription><FormMessage /></FormItem>)} />
        </div>

        <Button type="submit">{question ? "Update" : "Create"} Question</Button>
      </form>
    </Form>
  );
}
