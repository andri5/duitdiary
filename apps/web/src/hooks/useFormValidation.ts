/**
 * Form Validation Hook
 * Validates form inputs and provides error messages
 */

import { useState, useCallback } from 'react';

export interface ValidationRules {
  required?: string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | true;
  custom?: (value: string) => Promise<string | true>;
}

export interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    async (name: string, value: string, rules?: ValidationRules): Promise<boolean> => {
      if (!rules) return true;

      let error = '';

      // Required validation
      if (rules.required && !value?.trim()) {
        error = rules.required;
        setErrors(prev => ({ ...prev, [name]: error }));
        return false;
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength.value) {
        error = rules.minLength.message;
        setErrors(prev => ({ ...prev, [name]: error }));
        return false;
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength.value) {
        error = rules.maxLength.message;
        setErrors(prev => ({ ...prev, [name]: error }));
        return false;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.value.test(value)) {
        error = rules.pattern.message;
        setErrors(prev => ({ ...prev, [name]: error }));
        return false;
      }

      // Custom sync validation
      if (rules.validate) {
        const result = rules.validate(value);
        if (result !== true) {
          error = result;
          setErrors(prev => ({ ...prev, [name]: error }));
          return false;
        }
      }

      // Custom async validation
      if (rules.custom) {
        setIsValidating(true);
        const result = await rules.custom(value);
        setIsValidating(false);
        if (result !== true) {
          error = result;
          setErrors(prev => ({ ...prev, [name]: error }));
          return false;
        }
      }

      // Clear error if validation passed
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    },
    []
  );

  const validateForm = useCallback(
    async (formData: { [key: string]: string }, rulesMap: { [key: string]: ValidationRules }): Promise<boolean> => {
      setIsValidating(true);
      const validations = await Promise.all(
        Object.keys(rulesMap).map(key =>
          validateField(key, formData[key], rulesMap[key])
        )
      );
      setIsValidating(false);
      return validations.every(v => v === true);
    },
    [validateField]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((name: string): string | undefined => {
    return errors[name];
  }, [errors]);

  return {
    errors,
    isValidating,
    validateField,
    validateForm,
    clearErrors,
    getFieldError,
  };
};

// Common validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  },
  PASSWORD: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  PASSWORD_CONFIRM: {
    required: 'Please confirm your password',
  },
  NAME: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Name must not exceed 50 characters',
    },
  },
  AMOUNT: {
    required: 'Amount is required',
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Amount must be a valid number',
    },
    validate: (value: string) => {
      const num = parseFloat(value);
      if (num <= 0) return 'Amount must be greater than 0';
      if (num > 999999999.99) return 'Amount exceeds maximum allowed value';
      return true;
    },
  },
  CATEGORY_NAME: {
    required: 'Category name is required',
    minLength: {
      value: 2,
      message: 'Category name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Category name must not exceed 50 characters',
    },
  },
  DESCRIPTION: {
    maxLength: {
      value: 500,
      message: 'Description must not exceed 500 characters',
    },
  },
  DATE: {
    pattern: {
      value: /^\d{4}-\d{2}-\d{2}$/,
      message: 'Date format must be YYYY-MM-DD',
    },
    validate: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) return 'Expense date cannot be in the future';
      return true;
    },
  },
  COLOR: {
    pattern: {
      value: /^#[0-9A-F]{6}$/i,
      message: 'Color must be in hex format (#RRGGBB)',
    },
  },
};
