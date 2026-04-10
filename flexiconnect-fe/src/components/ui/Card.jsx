import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const cardVariants = cva(
  'rounded-card bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border border-border shadow-soft',
        hover: 'border border-border shadow-soft hover:shadow-soft-md hover:border-beige-300 dark:hover:border-dark-border-primary',
        elevated: 'border border-border shadow-soft-md dark:bg-dark-bg-tertiary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, className }))}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 px-6 py-4 border-b border-border', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardBody = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardBody.displayName = 'CardBody';

const CardContent = CardBody;
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center px-6 py-4 border-t border-border', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardContent, CardFooter, cardVariants };
export default Card;
