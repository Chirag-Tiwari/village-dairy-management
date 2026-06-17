import React from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`card p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
