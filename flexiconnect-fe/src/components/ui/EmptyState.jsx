import * as React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

const EmptyState = React.forwardRef(({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col items-center justify-center py-16 px-6 text-center',
      className
    )}
    {...props}
  >
    {Icon && (
      <div className="mb-6 p-4 rounded-full bg-muted">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>
    )}
    {title && (
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
    )}
    {description && (
      <p className="text-muted-foreground max-w-md mb-6">
        {description}
      </p>
    )}
    {action && actionLabel && (
      <Button onClick={action} variant="default">
        {actionLabel}
      </Button>
    )}
  </div>
));

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export default EmptyState;
