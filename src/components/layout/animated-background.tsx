"use client";

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full -z-10"
      initial={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.05) 100%)',
      }}
      animate={{
        background: [
          'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.05) 100%)',
          'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--accent) / 0.05) 100%)',
          'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.05) 100%)',
        ],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    />
  );
}
