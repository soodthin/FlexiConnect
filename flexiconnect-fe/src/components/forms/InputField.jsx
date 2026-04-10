import * as React from 'react';
import { cn } from '@/utils/cn';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

const InputField = React.forwardRef(({
  label,
  error,
  success,
  hint,
  required,
  className,
  inputClassName,
  ...props
}, ref) => (
  <div className={cn('space-y-2', className)}>
    {label && (
      <Label
        htmlFor={props.id}
        className={cn(
          'text-sm font-medium',
          error && 'text-error-600 dark:text-error-400'
        )}
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </Label>
    )}
    <Input
      ref={ref}
      error={!!error}
      success={!!success}
      className={inputClassName}
      {...props}
    />
    {hint && !error && (
      <p className="text-xs text-muted-foreground">{hint}</p>
    )}
    {error && (
      <p className="text-sm text-error-600 dark:text-error-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
    {success && typeof success === 'string' && (
      <p className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {success}
      </p>
    )}
  </div>
));

InputField.displayName = 'InputField';

export default InputField;
