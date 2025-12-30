/**
 * DuitDiary - Input Component
 * Modern glassmorphism input with icons
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
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
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    const isGlass = variant === 'glass';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              isGlass ? 'text-white/90' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors',
                isGlass ? 'text-white/60' : 'text-gray-400'
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none disabled:cursor-not-allowed sm:py-3 sm:text-base',
              leftIcon ? 'pl-10 sm:pl-11' : '',
              rightIcon ? 'pr-10 sm:pr-11' : '',
              isGlass
                ? cn(
                    'border border-blue-400/40 bg-blue-950/30 text-white placeholder-blue-200/50 backdrop-blur-sm',
                    'focus:border-blue-400/60 focus:bg-blue-950/40 focus:ring-2 focus:ring-blue-400/30',
                    error && 'border-red-400/60 focus:border-red-400 focus:ring-red-400/30'
                  )
                : cn(
                    'border border-gray-300 bg-white text-gray-900 placeholder-gray-400',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    'disabled:bg-gray-50 disabled:text-gray-500'
                  ),
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3',
                isGlass ? 'text-white/60' : 'text-gray-400'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className={cn('mt-1.5 text-sm', isGlass ? 'text-red-300' : 'text-red-600')}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={cn('mt-1.5 text-sm', isGlass ? 'text-white/60' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
