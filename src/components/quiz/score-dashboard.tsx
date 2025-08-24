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
  const quizzes = useQuizStore((state) => state.quizzes);
  const hasMounted = useHasMounted();

  const stats = useMemo(() => {
    if (!quizzes) return null;
    const attemptedQuizzes = quizzes.filter((q) => q.lastResult);
    if (attemptedQuizzes.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        quizzesAttempted: 0,
        quizzesMastered: 0,
        scoreDistribution: [],
      };
    }
    
    const totalAttempts = quizzes.reduce((sum, q) => sum + (q.attempts || 0), 0);
    const averageScore =
      attemptedQuizzes.reduce((sum, q) => sum + q.lastResult!.score, 0) /
      attemptedQuizzes.length;
    
    const scoreDistribution = [
        { name: '0-20%', count: attemptedQuizzes.filter(q => q.lastResult!.score <= 20).length },
        { name: '21-40%', count: attemptedQuizzes.filter(q => q.lastResult!.score > 20 && q.lastResult!.score <= 40).length },
        { name: '41-60%', count: attemptedQuizzes.filter(q => q.lastResult!.score > 40 && q.lastResult!.score <= 60).length },
        { name: '61-80%', count: attemptedQuizzes.filter(q => q.lastResult!.score > 60 && q.lastResult!.score <= 80).length },
        { name: '81-100%', count: attemptedQuizzes.filter(q => q.lastResult!.score > 80).length },
    ]

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      quizzesAttempted: attemptedQuizzes.length,
      quizzesMastered: attemptedQuizzes.filter(q => q.lastResult!.score === 100).length,
      scoreDistribution,
    };
  }, [quizzes]);

  if (!hasMounted || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        <Skeleton className="h-80 w-full md:col-span-4" />
      </div>
    );
  }

  const chartConfig: ChartConfig = {
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
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">For all attempted quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Attempted</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quizzesAttempted} / {quizzes.length}</div>
            <p className="text-xs text-muted-foreground">Total unique quizzes taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Mastered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quizzesMastered}</div>
            <p className="text-xs text-muted-foreground">Scored 100%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
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
  );
}
