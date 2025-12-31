/**
 * DuitDiary - Select Component
 * Custom select dropdown with advanced micro-interactions and animations
 */

import { forwardRef, useState } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  animated?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      onFocus,
      onBlur,
      animated = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const selectId = id || props.name;

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            htmlFor={selectId}
            animate={isFocused ? { scale: 0.95, opacity: 0.8 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mb-1.5 block text-sm font-medium transition-colors text-gray-700',
              isFocused && 'text-blue-600'
            )}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {/* Animated focus glow */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute -inset-0.5 rounded-lg bg-blue-400/20 opacity-0 blur"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <motion.select
            ref={ref}
            id={selectId}
            className={cn(
              'relative w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-900 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              isFocused && 'border-blue-500 ring-2 ring-blue-500/20',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            <AnimatePresence>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AnimatePresence>
          </motion.select>

          {/* Animated chevron icon */}
          <motion.div 
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            animate={isFocused ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className={cn('h-4 w-4 transition-colors', isFocused ? 'text-blue-500' : 'text-gray-400')} />
          </motion.div>
        </div>

        {/* Error message with animation */}
        {error && animated && (
          <motion.p 
            className="mt-1.5 text-sm text-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
        {error && !animated && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

        {/* Helper text with animation */}
        {helperText && !error && animated && (
          <motion.p 
            className="mt-1.5 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {helperText}
          </motion.p>
        )}
        {helperText && !error && !animated && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
