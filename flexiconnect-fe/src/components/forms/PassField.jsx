import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const PasswordField = React.forwardRef(({
  label,
  error,
  hint,
  required,
  className,
  inputClassName,
  showStrength,
  value,
  ...props
}, ref) => {
  const [show, setShow] = useState(false);

  // Calculate password strength
  const getStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const strength = getStrength(value);
  const strengthLabel = strength <= 25 ? 'Yếu' : strength <= 50 ? 'Trung bình' : strength <= 75 ? 'Khá' : 'Mạnh';
  const strengthColor = strength <= 25 ? 'bg-error-500' : strength <= 50 ? 'bg-warning-500' : strength <= 75 ? 'bg-info-500' : 'bg-success-500';

  return (
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
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          error={!!error}
          value={value}
          className={cn('pr-10', inputClassName)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Password strength indicator */}
      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  strength >= i * 25 ? strengthColor : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className={cn(
            'text-xs',
            strength <= 25 ? 'text-error-500' :
            strength <= 50 ? 'text-warning-500' :
            strength <= 75 ? 'text-info-500' : 'text-success-500'
          )}>
            Độ mạnh: {strengthLabel}
          </p>
        </div>
      )}

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
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
