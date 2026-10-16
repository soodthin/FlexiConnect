import * as React from 'react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { getCompanyLogo } from '@/utils/companyLogos';
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
  ArrowUpRight,
  CheckCircle2,
  Flame,
} from 'lucide-react';

// Format salary helper
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Thoả thuận';
  if (!min) return `Tới ${max} triệu`;
  if (!max) return `Từ ${min} triệu`;
  return `${min} - ${max} triệu`;
};

// Calculate days remaining
export const getDaysRemaining = (expirationDate) => {
  if (!expirationDate) return null;
  const now = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Job type labels in Vietnamese
export const jobTypeLabels = {
  FULLTIME: 'Toàn thời gian',
  PARTTIME: 'Bán thời gian',
  REMOTE: 'Làm từ xa',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Thực tập',
};

// Helper to extract dynamic tags for cards
export const getJobTags = (job) => {
  const tags = [];
  const title = (job.title || '').toLowerCase();
  
  if (title.includes('kinh doanh') || title.includes('sales')) tags.push('Kinh doanh');
  if (title.includes('trưởng phòng') || title.includes('giám đốc') || title.includes('quản lý') || title.includes('lead')) tags.push('Quản lý');
  if (title.includes('designer') || title.includes('thiết kế')) tags.push('Thiết kế');
  if (title.includes('kỹ thuật') || title.includes('cơ khí') || title.includes('kỹ sư')) tags.push('Kỹ thuật');
  if (title.includes('kế toán') || title.includes('tài chính')) tags.push('Tài chính');
  if (title.includes('marketing') || title.includes('digital')) tags.push('Marketing');
  if (title.includes('qc') || title.includes('qa')) tags.push('QA / QC');
  if (title.includes('hr') || title.includes('nhân sự')) tags.push('Nhân sự');
  if (title.includes('đấu thầu')) tags.push('Dự án');
  if (title.includes('vật tư') || title.includes('giao hàng')) tags.push('Vận hành');

  if (job.jobType && tags.length < 2) {
    tags.push(jobTypeLabels[job.jobType] || job.jobType);
  }

  if (tags.length === 0) {
    tags.push('Đãi ngộ tốt', 'Môi trường trẻ');
  }
  
  return tags.slice(0, 3);
};

/**
 * 1. Default Grid Card - High-end modern card with glassmorphic accents & micro-animations
 */
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
  const logoUrl = getCompanyLogo(job.companyName, job.avatar);
  const daysRemaining = getDaysRemaining(job.expiredAt || job.expirationDate);
  const isNew = job.createdAt && (new Date() - new Date(job.createdAt)) < 5 * 24 * 60 * 60 * 1000;
  const isHot = job.viewCount > 15 || variant === 'featured';
  const isUrgent = daysRemaining !== null && daysRemaining <= 5 && daysRemaining > 0;
  const tags = getJobTags(job);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-300 cursor-pointer overflow-hidden',
        'border-border/80 hover:border-beige-500/60 dark:hover:border-beige-400/60',
        'hover:shadow-soft-xl hover:-translate-y-1.5',
        variant === 'featured' && 'ring-1 ring-amber-500/40 border-amber-400/50 shadow-soft-md bg-gradient-to-b from-amber-50/20 to-card dark:from-amber-950/10',
        className
      )}
      {...props}
    >
      {/* Decorative top gradient glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-beige-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(variant === 'featured' || isHot) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              <Sparkles className="w-3 h-3" /> Nổi bật
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500 text-white shadow-sm">
              Mới
            </span>
          )}
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-500 text-white shadow-sm">
              <Flame className="w-3 h-3" /> Gấp
            </span>
          )}
        </div>

        {/* Bookmark Action */}
        {onSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(job.id);
            }}
            className={cn(
              'p-2 rounded-xl transition-all duration-200 text-muted-foreground',
              'hover:bg-muted hover:text-foreground',
              isSaved && 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40'
            )}
            aria-label={isSaved ? 'Bỏ lưu' : 'Lưu việc làm'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Header: Company logo & Job title */}
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          <Avatar size="lg" className="shrink-0 ring-2 ring-border/60 shadow-sm bg-white dark:bg-dark-bg-secondary">
            <AvatarImage src={logoUrl} alt={job.companyName} />
            <AvatarFallback className="text-base font-bold bg-beige-200 dark:bg-dark-bg-tertiary">
              {job.companyName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-beige-700 dark:group-hover:text-beige-300 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate font-medium">
              <span className="truncate">{job.companyName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 inline-block" />
            </p>
          </div>
        </div>

        {/* Salary Highlight Badge */}
        <div className="mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        {/* Meta details: Location & Job Type */}
        <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
          {job.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          )}
          {job.jobType && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
              <span>{jobTypeLabels[job.jobType] || job.jobType}</span>
            </div>
          )}
        </div>

        {/* Skill / Field Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Expiration & Action Button */}
      <div className="pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {daysRemaining !== null
              ? daysRemaining <= 0
                ? 'Đã hết hạn'
                : `Còn ${daysRemaining} ngày`
              : 'Đang tuyển'}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-beige-700 dark:text-beige-300 group-hover:translate-x-0.5 transition-transform">
          Xem JD <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
});
JobCard.displayName = 'JobCard';

/**
 * 2. Horizontal Row View (List Mode) - Clean, streamlined browsing
 */
export const JobCardRow = React.forwardRef(({
  job,
  onClick,
  onSave,
  isSaved = false,
  className,
  ...props
}, ref) => {
  const logoUrl = getCompanyLogo(job.companyName, job.avatar);
  const daysRemaining = getDaysRemaining(job.expiredAt || job.expirationDate);
  const tags = getJobTags(job);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border bg-card transition-all duration-200 cursor-pointer',
        'border-border/80 hover:border-beige-500/60 dark:hover:border-beige-400/60 hover:shadow-soft-lg hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {/* Left: Logo & Job Info */}
      <div className="flex items-start md:items-center gap-4 min-w-0 flex-1">
        <Avatar size="lg" className="shrink-0 ring-2 ring-border/50 shadow-sm bg-white dark:bg-dark-bg-secondary">
          <AvatarImage src={logoUrl} alt={job.companyName} />
          <AvatarFallback className="text-base font-bold bg-beige-200 dark:bg-dark-bg-tertiary">
            {job.companyName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-foreground text-base group-hover:text-beige-700 dark:group-hover:text-beige-300 transition-colors">
              {job.title}
            </h3>
            {job.viewCount > 15 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                HOT
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground/80 flex items-center gap-1">
              {job.companyName}
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </span>
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            )}
            {job.jobType && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {jobTypeLabels[job.jobType] || job.jobType}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Salary & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
        <div className="text-left md:text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            {daysRemaining !== null ? `Còn ${daysRemaining} ngày` : 'Đang tuyển'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave(job.id);
              }}
              className="p-2 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-beige-100 dark:bg-beige-950/50 text-beige-800 dark:text-beige-200 text-xs font-semibold group-hover:bg-beige-600 group-hover:text-white transition-all">
            Xem ngay
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
});
JobCardRow.displayName = 'JobCardRow';

/**
 * 3. Split View Card - Compact and interactive for the Split List
 */
export const JobCardSplit = React.forwardRef(({
  job,
  isSelected = false,
  onClick,
  className,
  ...props
}, ref) => {
  const logoUrl = getCompanyLogo(job.companyName, job.avatar);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-beige-500 ring-2 ring-beige-500/30 bg-beige-50/50 dark:bg-beige-950/30 shadow-soft-sm'
          : 'border-border/70 bg-card hover:border-beige-400/50 hover:bg-muted/30',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Avatar size="default" className="shrink-0 ring-1 ring-border/50 bg-white dark:bg-dark-bg-secondary shadow-xs mt-0.5">
          <AvatarImage src={logoUrl} alt={job.companyName} />
          <AvatarFallback className="text-xs font-bold">
            {job.companyName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'text-sm font-bold leading-tight line-clamp-1 group-hover:text-beige-600 dark:group-hover:text-beige-400 transition-colors',
            isSelected && 'text-beige-700 dark:text-beige-300'
          )}>
            {job.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {job.companyName}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[110px]">
              {job.location ? job.location.split(',')[0] : 'Việt Nam'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
JobCardSplit.displayName = 'JobCardSplit';

/**
 * 4. Compact Variant (for drawer or small spaces)
 */
export const JobCardCompact = React.forwardRef(({ job, onClick, className, ...props }, ref) => {
  const logoUrl = getCompanyLogo(job.companyName, job.avatar);
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted',
        className
      )}
      {...props}
    >
      <Avatar size="sm" className="bg-white dark:bg-dark-bg-secondary shadow-sm">
        <AvatarImage src={logoUrl} alt={job.companyName} />
        <AvatarFallback className="text-xs">
          {job.companyName?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{job.title}</p>
        <p className="text-xs text-muted-foreground truncate">{job.companyName}</p>
      </div>
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
        {formatSalary(job.salaryMin, job.salaryMax)}
      </span>
    </div>
  );
});
JobCardCompact.displayName = 'JobCardCompact';

/**
 * 5. Skeleton loading state
 */
export const JobCardSkeleton = ({ variant = 'default' }) => (
  <div className={cn(
    'rounded-2xl border border-border/80 bg-card p-5 animate-pulse shadow-sm',
    variant === 'compact' ? 'p-3.5' : 'p-5'
  )}>
    <div className="flex items-start gap-3.5 mb-4">
      <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-5 bg-muted rounded w-4/5" />
        <div className="h-3.5 bg-muted rounded w-1/2" />
      </div>
    </div>
    <div className="h-6 w-28 bg-muted rounded-full mb-3" />
    <div className="space-y-2 mb-4">
      <div className="h-3.5 bg-muted rounded w-2/3" />
      <div className="h-3.5 bg-muted rounded w-1/2" />
    </div>
    <div className="flex gap-2 pt-3 border-t border-border/40">
      <div className="h-6 w-16 bg-muted rounded-md" />
      <div className="h-6 w-20 bg-muted rounded-md" />
    </div>
  </div>
);

export { JobCard };
export default JobCard;
