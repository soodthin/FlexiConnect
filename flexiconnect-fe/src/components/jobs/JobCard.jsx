import * as React from 'react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import {
  MapPin,
  Banknote,
  Briefcase,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

// Format salary helper
const formatSalary = (min, max) => {
  if (!min && !max) return 'Thoả thuận';
  if (!min) return `Tới ${max} triệu`;
  if (!max) return `Từ ${min} triệu`;
  return `${min} - ${max} triệu`;
};

// Calculate days remaining
const getDaysRemaining = (expirationDate) => {
  if (!expirationDate) return null;
  const now = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Job type labels in Vietnamese
const jobTypeLabels = {
  FULLTIME: 'Toàn thời gian',
  PARTTIME: 'Bán thời gian',
  REMOTE: 'Làm từ xa',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Thực tập',
};

const JobCard = React.forwardRef(({
  job,
  onClick,
  onSave,
  isSaved = false,
  variant = 'default',
  showStats = false,
  className,
  ...props
}, ref) => {
  const daysRemaining = getDaysRemaining(job.expirationDate);
  const isNew = job.createdAt && (new Date() - new Date(job.createdAt)) < 3 * 24 * 60 * 60 * 1000; // 3 days
  const isHot = job.applicationCount > 10;
  const isUrgent = daysRemaining !== null && daysRemaining <= 3 && daysRemaining > 0;

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border bg-card transition-all duration-300 cursor-pointer',
        'hover:shadow-soft-lg hover:-translate-y-1 hover:border-beige-400 dark:hover:border-beige-600',
        variant === 'featured' && 'border-beige-400 dark:border-beige-600 shadow-soft-md',
        variant === 'compact' && 'p-4',
        variant === 'default' && 'p-5',
        className
      )}
      {...props}
    >
      {/* Featured/New/Hot badges */}
      {(isNew || isHot || isUrgent || variant === 'featured') && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {variant === 'featured' && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Nổi bật
            </span>
          )}
          {isNew && variant !== 'featured' && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-success-500 text-white">
              Mới
            </span>
          )}
          {isHot && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-error-500 text-white flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Hot
            </span>
          )}
          {isUrgent && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning-500 text-white">
              Gấp
            </span>
          )}
        </div>
      )}

      {/* Save button */}
      {onSave && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(job.id);
          }}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100',
            'hover:bg-muted',
            isSaved && 'opacity-100 text-beige-600'
          )}
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu việc làm'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Header: Company logo & Job title */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar size="lg" className="shrink-0 ring-2 ring-border">
          <AvatarImage src={job.avatar} alt={job.companyName} />
          <AvatarFallback className="text-lg font-semibold bg-beige-200 dark:bg-dark-bg-tertiary">
            {job.companyName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-beige-700 dark:group-hover:text-beige-300 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* Job details */}
      <div className="space-y-2 mb-4">
        {/* Salary */}
        <div className="flex items-center gap-2 text-sm">
          <Banknote className="w-4 h-4 text-success-600 dark:text-success-400 shrink-0" />
          <span className="font-medium text-success-700 dark:text-success-300">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        {/* Location */}
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}

        {/* Job type */}
        {job.jobType && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>{jobTypeLabels[job.jobType] || job.jobType}</span>
          </div>
        )}
      </div>

      {/* Tags/Badges */}
      <div className="flex flex-wrap gap-2">
        {job.jobType && (
          <Badge variant="secondary" className="text-xs">
            {jobTypeLabels[job.jobType] || job.jobType}
          </Badge>
        )}
        {daysRemaining !== null && (
          <Badge
            variant={
              daysRemaining <= 0 ? 'error' :
              daysRemaining <= 3 ? 'warning' :
              daysRemaining <= 7 ? 'info' : 'neutral'
            }
            className="text-xs flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            {daysRemaining <= 0 ? 'Hết hạn' : `Còn ${daysRemaining} ngày`}
          </Badge>
        )}
      </div>

      {/* Stats row (optional) */}
      {showStats && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          {job.viewCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.viewCount} lượt xem
            </span>
          )}
          {job.applicationCount !== undefined && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {job.applicationCount} ứng viên
            </span>
          )}
        </div>
      )}
    </div>
  );
});

JobCard.displayName = 'JobCard';

// Compact variant for sidebar/lists
const JobCardCompact = React.forwardRef(({ job, onClick, className, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
      'hover:bg-muted',
      className
    )}
    {...props}
  >
    <Avatar size="sm">
      <AvatarImage src={job.avatar} alt={job.companyName} />
      <AvatarFallback className="text-xs">
        {job.companyName?.[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{job.title}</p>
      <p className="text-xs text-muted-foreground truncate">{job.companyName}</p>
    </div>
    <span className="text-xs font-medium text-success-600 dark:text-success-400 whitespace-nowrap">
      {formatSalary(job.salaryMin, job.salaryMax)}
    </span>
  </div>
));

JobCardCompact.displayName = 'JobCardCompact';

// Skeleton loading state
const JobCardSkeleton = ({ variant = 'default' }) => (
  <div className={cn(
    'rounded-xl border border-border bg-card animate-pulse',
    variant === 'compact' ? 'p-4' : 'p-5'
  )}>
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-muted rounded-full" />
      <div className="h-6 w-24 bg-muted rounded-full" />
    </div>
  </div>
);

export { JobCard, JobCardCompact, JobCardSkeleton };
export default JobCard;
