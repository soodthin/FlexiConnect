import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-soft bg-background text-foreground transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-2 border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent dark:bg-dark-bg-tertiary dark:border-dark-border-subtle dark:focus-visible:ring-beige-400',
        error:
          'border-2 border-error-500 dark:border-error-400 focus-visible:ring-2 focus-visible:ring-error-500',
        success:
          'border-2 border-success-500 dark:border-success-400 focus-visible:ring-2 focus-visible:ring-success-500',
      },
      inputSize: {
        default: 'h-10 px-4 py-2.5 text-sm',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

const Input = React.forwardRef(
  ({ className, type = 'text', variant, inputSize, error, success, ...props }, ref) => {
    const resolvedVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: resolvedVariant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

const textareaVariants = cva(
  'flex min-h-[100px] w-full rounded-soft bg-background text-foreground transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y',
  {
    variants: {
      variant: {
        default:
          'border-2 border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent dark:bg-dark-bg-tertiary dark:border-dark-border-subtle dark:focus-visible:ring-beige-400',
        error:
          'border-2 border-error-500 dark:border-error-400 focus-visible:ring-2 focus-visible:ring-error-500',
        success:
          'border-2 border-success-500 dark:border-success-400 focus-visible:ring-2 focus-visible:ring-success-500',
      },
      textareaSize: {
        default: 'px-4 py-2.5 text-sm',
        sm: 'px-3 py-1.5 text-xs',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'default',
    },
  }
);

const Textarea = React.forwardRef(
  ({ className, variant, textareaSize, error, success, ...props }, ref) => {
    const resolvedVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <textarea
        className={cn(textareaVariants({ variant: resolvedVariant, textareaSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

const selectVariants = cva(
  'flex w-full rounded-soft bg-background text-foreground transition-all duration-200 cursor-pointer appearance-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-2 border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent dark:bg-dark-bg-tertiary dark:border-dark-border-subtle dark:focus-visible:ring-beige-400',
        error:
          'border-2 border-error-500 dark:border-error-400 focus-visible:ring-2 focus-visible:ring-error-500',
        success:
          'border-2 border-success-500 dark:border-success-400 focus-visible:ring-2 focus-visible:ring-success-500',
      },
      selectSize: {
        default: 'h-10 px-4 py-2.5 text-sm',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'default',
    },
  }
);

const Select = React.forwardRef(
  ({ children, className, placeholder = 'Select an option', variant, selectSize, error, success, ...props }, ref) => {
    const resolvedVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <select
        ref={ref}
        className={cn(selectVariants({ variant: resolvedVariant, selectSize, className }))}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export { Input, Textarea, Select, inputVariants, textareaVariants, selectVariants };
export default Input;
