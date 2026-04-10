import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input text-foreground',
        success: 'bg-success-100 text-success-700 dark:bg-success-700 dark:text-success-100',
        warning: 'bg-warning-100 text-warning-700 dark:bg-warning-700 dark:text-warning-100',
        error: 'bg-error-100 text-error-700 dark:bg-error-700 dark:text-error-100',
        info: 'bg-info-100 text-info-700 dark:bg-info-700 dark:text-info-100',
        neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(badgeVariants({ variant, className }))}
    {...props}
  />
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
export default Badge;
