"use client";

import { useMemo } from "react";
import { useQuizStore } from "@/store/quiz";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { CheckCircle, Target, TrendingUp, Zap } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export function ScoreDashboard() {
  const questions = useQuizStore((state) => state.questions);
  const hasMounted = useHasMounted();

  const stats = useMemo(() => {
    if (!questions) return null;
    const attemptedQuestions = questions.filter((q) => q.lastResult);
    if (attemptedQuestions.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        questionsAttempted: 0,
        questionsMastered: 0,
        performanceByDifficulty: [],
        scoreDistribution: [],
      };
    }
    
    const totalAttempts = questions.reduce((sum, q) => sum + (q.attempts || 0), 0);
    const averageScore =
      attemptedQuestions.reduce((sum, q) => sum + q.lastResult!.score, 0) /
      attemptedQuestions.length;
    
    const performanceByDifficulty = (['easy', 'medium', 'hard'] as const).map(level => {
        const relevantQs = attemptedQuestions.filter(q => q.difficulty === level);
        const avgScore = relevantQs.length > 0 ? relevantQs.reduce((sum, q) => sum + q.lastResult!.score, 0) / relevantQs.length : 0;
        return { name: level, score: Math.round(avgScore) };
    });

    const scoreDistribution = [
        { name: '0-20%', count: attemptedQuestions.filter(q => q.lastResult!.score <= 20).length },
        { name: '21-40%', count: attemptedQuestions.filter(q => q.lastResult!.score > 20 && q.lastResult!.score <= 40).length },
        { name: '41-60%', count: attemptedQuestions.filter(q => q.lastResult!.score > 40 && q.lastResult!.score <= 60).length },
        { name: '61-80%', count: attemptedQuestions.filter(q => q.lastResult!.score > 60 && q.lastResult!.score <= 80).length },
        { name: '81-100%', count: attemptedQuestions.filter(q => q.lastResult!.score > 80).length },
    ]

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      questionsAttempted: attemptedQuestions.length,
      questionsMastered: attemptedQuestions.filter(q => q.lastResult!.score === 100).length,
      performanceByDifficulty,
      scoreDistribution,
    };
  }, [questions]);

  if (!hasMounted || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        <Skeleton className="h-80 w-full md:col-span-2" />
        <Skeleton className="h-80 w-full md:col-span-2" />
      </div>
    );
  }

  const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
    count: {
        label: "Count",
        color: "hsl(var(--accent))",
    }
  };


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Across all questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">For all attempted questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAttempted} / {questions.length}</div>
            <p className="text-xs text-muted-foreground">Total unique questions answered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsMastered}</div>
            <p className="text-xs text-muted-foreground">Scored 100%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.performanceByDifficulty} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.scoreDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
