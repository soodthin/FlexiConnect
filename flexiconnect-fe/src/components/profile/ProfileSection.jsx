import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { ChevronRight } from 'lucide-react';

const profileSectionVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-soft',
        elevated: 'bg-card border border-border shadow-soft-md',
        ghost: 'bg-transparent',
        gradient: 'bg-gradient-to-br from-card to-muted/30 border border-border shadow-soft',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const ProfileSection = React.forwardRef(
  ({ className, variant, id, innerRef, children, ...props }, ref) => (
    <section
      id={id}
      ref={innerRef || ref}
      className={cn(profileSectionVariants({ variant, className }))}
      {...props}
    >
      {children}
    </section>
  )
);
ProfileSection.displayName = 'ProfileSection';

const ProfileSectionHeader = React.forwardRef(
  ({ className, children, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-border',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">{children}</div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
);
ProfileSectionHeader.displayName = 'ProfileSectionHeader';

const ProfileSectionTitle = React.forwardRef(
  ({ className, icon: Icon, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold text-foreground flex items-center gap-2',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-beige-600 dark:text-beige-400" />}
      {children}
    </h3>
  )
);
ProfileSectionTitle.displayName = 'ProfileSectionTitle';

const ProfileSectionContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
);
ProfileSectionContent.displayName = 'ProfileSectionContent';

const ProfileSectionFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ProfileSectionFooter.displayName = 'ProfileSectionFooter';

// Navigation item for sidebar
const ProfileNavItem = React.forwardRef(
  ({ className, icon: Icon, label, isActive, onClick, badge, ...props }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground shadow-soft'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
          {badge}
        </span>
      )}
      <ChevronRight className={cn(
        'w-4 h-4 transition-transform',
        isActive && 'rotate-90'
      )} />
    </button>
  )
);
ProfileNavItem.displayName = 'ProfileNavItem';

export {
  ProfileSection,
  ProfileSectionHeader,
  ProfileSectionTitle,
  ProfileSectionContent,
  ProfileSectionFooter,
  ProfileNavItem,
  profileSectionVariants,
};
