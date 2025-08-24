"use client";

import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    </MotionConfig>
  );
}
