import * as React from 'react';
import { cn } from '../../utils/cn';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Camera, Crown, Verified, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

const ProfileCard = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft-md',
        className
      )}
      {...props}
    >
      {/* Gradient Background Header */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-beige-300 via-beige-200 to-beige-100 dark:from-dark-bg-tertiary dark:via-dark-bg-secondary dark:to-dark-bg-primary" />
      {children}
    </div>
  )
);
ProfileCard.displayName = 'ProfileCard';

const ProfileCardHeader = React.forwardRef(
  ({
    className,
    avatar,
    name,
    title,
    email,
    phone,
    address,
    isVerified,
    isPremium,
    onAvatarChange,
    onEdit,
    avatarTimestamp,
    ...props
  }, ref) => {
    const getInitials = (name) => {
      if (!name) return 'U';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
      <div ref={ref} className={cn('relative pt-16 px-6 pb-6', className)} {...props}>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar with upload */}
          <div className="relative -mt-12 z-10">
            <Avatar size="3xl" className="ring-4 ring-card shadow-soft-lg">
              <AvatarImage
                src={avatar ? `${avatar}?t=${avatarTimestamp || Date.now()}` : undefined}
                alt={name}
              />
              <AvatarFallback className="text-2xl bg-beige-200 dark:bg-dark-bg-tertiary text-foreground">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            {onAvatarChange && (
              <label className="absolute bottom-1 right-1 p-2 bg-card rounded-full shadow-soft-md cursor-pointer hover:bg-accent transition-colors border border-border">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                  aria-label="Upload avatar"
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground truncate">
                    {name}
                  </h2>
                  {isPremium && (
                    <Badge variant="warning" className="gap-1">
                      <Crown className="w-3 h-3" />
                      Premium
                    </Badge>
                  )}
                  {isVerified !== undefined && (
                    <Badge variant={isVerified ? 'success' : 'error'} className="gap-1">
                      <Verified className="w-3 h-3" />
                      {isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </Badge>
                  )}
                </div>
                {title && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {title}
                  </p>
                )}
              </div>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {/* Contact info */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-beige-600 dark:text-beige-400" />
                  <span className="truncate">{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-beige-600 dark:text-beige-400" />
                  <span>{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
                  <MapPin className="w-4 h-4 text-beige-600 dark:text-beige-400 shrink-0" />
                  <span className="truncate">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ProfileCardHeader.displayName = 'ProfileCardHeader';

const ProfileCardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  )
);
ProfileCardContent.displayName = 'ProfileCardContent';

const ProfileStat = ({ icon: Icon, label, value, className }) => (
  <div className={cn(
    'flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50',
    className
  )}>
    {Icon && (
      <div className="p-2 rounded-lg bg-beige-200 dark:bg-dark-bg-tertiary">
        <Icon className="w-5 h-5 text-beige-700 dark:text-beige-300" />
      </div>
    )}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardContent,
  ProfileStat,
};
