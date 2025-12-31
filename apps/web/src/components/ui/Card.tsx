/**
 * DuitDiary - Card Component
 * Enhanced card with shadow elevation, glow effects, and animations
 */

import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glowing?: boolean;
  animated?: boolean;
}

const variantStyles = {
  default: 'bg-white',
  bordered: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'bordered',
      padding = 'md',
      hover = true,
      glowing = false,
      animated = true,
      children,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const backgroundImage = useMotionTemplate`
      radial-gradient(
        650px circle at ${mouseX}px ${mouseY}px,
        rgba(59, 130, 246, 0.15),
        transparent 80%
      )
    `;

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300 relative overflow-hidden',
          variantStyles[variant],
          paddingStyles[padding],
          hover && 'hover:shadow-xl',
          className
        )}
        onMouseMove={glowing ? handleMouseMove : undefined}
        {...props}
      >
        {/* Glow effect background */}
        {glowing && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{ backgroundImage: backgroundImage as any }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );

    if (!animated) {
      return cardContent;
    }

    return (
      <motion.div
        whileHover={hover ? { y: -4 } : {}}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {cardContent}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4 flex items-center justify-between', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

// Card Title
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';
