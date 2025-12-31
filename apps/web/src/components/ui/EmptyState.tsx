/**
 * DuitDiary - Empty State Component
 * Enhanced with animations
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  animated?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  animated = true,
}: EmptyStateProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {icon && (
        <motion.div 
          className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400"
          variants={itemVariants}
        >
          {icon}
        </motion.div>
      )}
      <motion.h3 
        className="text-lg font-semibold text-gray-900"
        variants={itemVariants}
      >
        {title}
      </motion.h3>
      {description && (
        <motion.p 
          className="mt-1 max-w-sm text-sm text-gray-500"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      )}
      {action && (
        <motion.div 
          className="mt-4"
          variants={itemVariants}
        >
          {action}
        </motion.div>
      )}
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {content}
    </motion.div>
  );
}
