'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface WrappedSlideContainerProps {
  children: ReactNode;
  currentSlide: number;
  direction: number;
}

export default function WrappedSlideContainer({
  children,
  currentSlide,
  direction,
}: WrappedSlideContainerProps) {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={currentSlide}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="min-h-screen overflow-y-auto flex items-start justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
