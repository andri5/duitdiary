/**
 * DuitDiary - Button Component
 * Modern button with gradient animations and responsive micro-interactions
 */

import { forwardRef, useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useResponsiveAnimationConfig } from '@/hooks/useMediaQuery';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
}

const variantStyles = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
  secondary:
    'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 disabled:bg-purple-300',
  outline:
    'border-2 border-blue-300 text-blue-700 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-200',
  ghost:
    'text-blue-700 hover:bg-blue-100 focus:ring-blue-500 disabled:text-blue-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  gradient:
    'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 disabled:opacity-50',
  glass:
    'border border-blue-400/50 bg-blue-500/20 text-white backdrop-blur-sm hover:bg-blue-500/30 focus:ring-blue-400/50 disabled:opacity-50',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-2.5 text-base sm:py-3 sm:text-lg',
};

// Gradient animation variants for gradient button
const gradientVariants = {
  initial: { backgroundPosition: '0% 50%' },
  hover: { backgroundPosition: '100% 50%' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      animated = true,
      onMouseDown,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const animConfig = useResponsiveAnimationConfig();

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        setIsPressed(true);
      }
      onMouseDown?.(e);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const buttonContent = (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed',
          variant === 'gradient' && 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-[length:200%_auto]',
          variantStyles[variant],
          sizeStyles[size],
          isFocused && 'shadow-lg',
          className
        )}
        variants={variant === 'gradient' ? gradientVariants : undefined}
        whileHover={variant === 'gradient' ? 'hover' : undefined}
        transition={variant === 'gradient' ? { duration: 0.6, ease: 'easeInOut' } : undefined}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.div>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );

    if (!animated) {
      return buttonContent;
    }

    return (
      <motion.div
        whileHover={disabled || isLoading || !animConfig.shouldAnimateHover ? {} : { scale: animConfig.hoverScale }}
        whileTap={disabled || isLoading ? {} : { scale: animConfig.tapScale }}
        transition={{ 
          type: 'spring', 
          damping: 20, 
          stiffness: 300,
          scale: { duration: animConfig.transitionDuration }
        }}
      >
        {buttonContent}
      </motion.div>
    );
  }
);

Button.displayName = 'Button';
