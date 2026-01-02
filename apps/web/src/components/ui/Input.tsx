/**
 * DuitDiary - Input Component
 * Modern glassmorphism input with floating label and validation animations
 */

import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      id,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);

    const inputId = id || props.name;
    const isGlass = variant === 'glass';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            htmlFor={inputId}
            animate={{
              scale: isFocused || hasValue ? 0.9 : 1,
              opacity: isFocused || hasValue ? 0.8 : 1,
              y: isFocused || hasValue ? -16 : 0,
            }}
            transition={{ duration: 0.2, type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              'mb-1.5 block text-sm font-medium transition-colors origin-left',
              isGlass ? 'text-white/90' : 'text-gray-700',
              isFocused && (isGlass ? 'text-blue-300' : 'text-blue-600'),
              (isFocused || hasValue) && 'absolute pointer-events-none'
            )}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {/* Animated focus glow */}
          {isFocused && (
            <motion.div
              className={cn(
                'absolute -inset-0.5 rounded-xl opacity-0 blur',
                isGlass 
                  ? 'bg-gradient-to-r from-blue-500/50 to-purple-500/50' 
                  : 'bg-blue-400/20'
              )}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {leftIcon && (
            <motion.div
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors',
                isGlass ? 'text-white/60' : 'text-gray-400',
                isFocused && (isGlass ? 'text-blue-300' : 'text-blue-500')
              )}
              animate={isFocused ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.div>
          )}

          <input
            ref={ref}
            id={inputId}
            placeholder={isFocused || hasValue ? '' : props.placeholder}
            className={cn(
              'relative w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none disabled:cursor-not-allowed sm:py-3 sm:text-base',
              leftIcon ? 'pl-10 sm:pl-11' : '',
              rightIcon ? 'pr-10 sm:pr-11' : '',
              isGlass
                ? cn(
                    'border border-blue-400/40 bg-blue-950/30 text-white backdrop-blur-sm',
                    isFocused && 'border-blue-400/80 bg-blue-950/50',
                    error && 'border-red-400/60',
                    !error && isFocused && 'border-blue-400/80 bg-blue-950/50'
                  )
                : cn(
                    'border border-gray-300 bg-white text-gray-900 placeholder-gray-400',
                    isFocused && 'border-blue-500 ring-2 ring-blue-500/20',
                    error && 'border-red-500',
                    'disabled:bg-gray-50 disabled:text-gray-500'
                  ),
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {rightIcon && (
            <motion.div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3 transition-colors',
                isGlass ? 'text-white/60' : 'text-gray-400',
                isFocused && (isGlass ? 'text-blue-300' : 'text-blue-500'),
                hasValue && 'text-green-500'
              )}
              animate={isFocused ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>

        {/* Error message with animation */}
        {error && (
          <motion.p 
            className={cn('mt-1.5 text-sm', isGlass ? 'text-red-300' : 'text-red-600')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}

        {/* Helper text with animation */}
        {helperText && !error && (
          <motion.p 
            className={cn('mt-1.5 text-sm', isGlass ? 'text-blue-200/70' : 'text-gray-500')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
