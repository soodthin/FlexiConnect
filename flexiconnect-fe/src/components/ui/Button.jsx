import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-soft text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-dark-bg-primary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-neutral-800 dark:hover:bg-beige-300 hover:shadow-soft-md',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:bg-red-700 hover:shadow-soft-md',
        outline:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground border-2 border-beige-300 dark:border-dark-border-primary hover:bg-beige-300 dark:hover:bg-dark-bg-elevated',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
        link:
          'text-beige-700 dark:text-beige-400 underline-offset-4 hover:underline hover:text-beige-900 dark:hover:text-beige-300',
        ai:
          'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-soft-md hover:shadow-soft-lg hover:from-purple-700 hover:to-indigo-700',
        success:
          'bg-success-600 text-white shadow-soft hover:bg-success-700 hover:shadow-soft-md',
        warning:
          'bg-warning-600 text-white shadow-soft hover:bg-warning-700 hover:shadow-soft-md',
        danger:
          'bg-error-600 text-white shadow-soft hover:bg-error-700 hover:shadow-soft-md',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10 p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
