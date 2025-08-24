"use client";

import { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Question } from "@/lib/types";
import { useQuizStore } from "@/store/quiz";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { QuestionForm } from "./question-form";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Skeleton } from "../ui/skeleton";

export function QuestionListEditor() {
  const { questions, deleteQuestion } = useQuizStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const hasMounted = useHasMounted();

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  if (!hasMounted) {
    return <Skeleton className="h-64 w-full" />;
  }
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Your Questions ({questions.length})</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </DialogTitle>
            </DialogHeader>
            <QuestionForm
              question={editingQuestion}
              onFinished={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium max-w-sm truncate">{question.question}</TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>
                  <Badge variant={question.difficulty === 'hard' ? 'destructive' : question.difficulty === 'medium' ? 'secondary' : 'default'}>
                    {question.difficulty || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(question)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the question.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteQuestion(question.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
