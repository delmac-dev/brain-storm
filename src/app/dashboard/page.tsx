"use client";

import { ScoreDashboard } from "@/components/quiz/score-dashboard";

export default function DashboardPage() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Your Dashboard
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    An overview of your quiz performance and progress.
                </p>
            </div>
            <ScoreDashboard />
        </div>
    );
}
