"use client";

import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./header";
import { ThemeProvider } from "./theme-provider";
import { GridBackground } from "./animated-background";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-screen flex-col bg-background">
          <GridBackground />
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
