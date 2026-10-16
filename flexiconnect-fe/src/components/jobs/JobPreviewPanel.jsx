import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getCompanyLogo } from '@/utils/companyLogos';
import { formatSalary, getDaysRemaining, jobTypeLabels, getJobTags } from '@/components/jobs/JobCard';
import {
  MapPin,
  Banknote,
  Briefcase,
  Clock,
  Sparkles,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Send,
  Eye,
  Check,
} from 'lucide-react';

export default function JobPreviewPanel({ job, onSave, isSaved = false, onClose }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!job) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-card rounded-2xl border border-border">
        <Building2 className="w-12 h-12 text-muted-foreground/40 mb-3" />
        <h4 className="font-semibold text-foreground">Chọn một việc làm để xem chi tiết</h4>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Click vào bất kỳ thẻ công việc nào ở danh sách bên trái để đọc nhanh JD và nộp hồ sơ.
        </p>
      </div>
    );
  }

  const logoUrl = getCompanyLogo(job.companyName, job.avatar);
  const daysRemaining = getDaysRemaining(job.expiredAt || job.expirationDate);
  const tags = getJobTags(job);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/job-posts/${job.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border/80 bg-card shadow-soft-lg overflow-hidden flex flex-col max-h-[calc(100vh-7rem)]">
      {/* Top Banner with subtle brand gradient */}
      <div className="relative bg-gradient-to-r from-beige-100 via-beige-50 to-amber-50 dark:from-dark-bg-tertiary dark:via-dark-bg-secondary dark:to-beige-950/30 p-6 border-b border-border/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar size="xl" className="ring-4 ring-white dark:ring-dark-bg-secondary shadow-md bg-white dark:bg-dark-bg-secondary">
              <AvatarImage src={logoUrl} alt={job.companyName} />
              <AvatarFallback className="text-xl font-bold bg-beige-200 dark:bg-dark-bg-tertiary">
                {job.companyName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold text-foreground/80">
                  {job.companyName}
                </span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <ShieldCheck className="w-3 h-3" /> Doanh nghiệp xác thực
                </span>
              </div>
              <h2 className="text-xl font-black text-foreground mt-1 leading-snug">
                {job.title}
              </h2>
            </div>
          </div>

          {/* Quick share & bookmark */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              title="Sao chép link"
              className="p-2 rounded-xl border border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            {onSave && (
              <button
                onClick={() => onSave(job.id)}
                title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
                className={cn(
                  'p-2 rounded-xl border border-border/60 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors',
                  isSaved && 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                )}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-2.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Mức lương
            </span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Địa điểm
            </span>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {job.location || 'Toàn quốc'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Hình thức
            </span>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {jobTypeLabels[job.jobType] || job.jobType || 'Toàn thời gian'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-card/80 border border-border/60">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Thời hạn nộp
            </span>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {daysRemaining !== null ? `Còn ${daysRemaining} ngày` : 'Đang mở'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 border-b border-border/60 bg-muted/20">
        <button
          onClick={() => setActiveTab('description')}
          className={cn(
            'py-3 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'description'
              ? 'border-beige-600 text-beige-700 dark:text-beige-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Chi tiết tuyển dụng
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={cn(
            'py-3 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'company'
              ? 'border-beige-600 text-beige-700 dark:text-beige-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Về công ty
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* AI Insight Box */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-purple-50/30 to-blue-50/40 dark:from-amber-950/20 dark:via-purple-950/10 dark:to-blue-950/20 border border-amber-300/40 dark:border-amber-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              FlexiConnect AI Match Insight
            </h4>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            Vị trí <strong>{job.title}</strong> tại <strong>{job.companyName}</strong> tìm kiếm ứng viên có năng lực thực chiến, tư duy giải quyết vấn đề và tinh thần trách nhiệm cao. 
            Mức đãi ngộ và lộ trình phát triển được đánh giá <strong>rất tốt</strong> trong ngành.
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {tags.map((t, i) => (
              <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 dark:bg-neutral-800/80 text-foreground/70 border border-border/50">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

        {activeTab === 'description' ? (
          <>
            {/* Job Description */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-beige-600" /> Mô tả công việc
              </h4>
              <div className="text-sm text-foreground/80 leading-relaxed space-y-2 whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/40">
                {job.description || (
                  `• Chịu trách nhiệm thực hiện các mục tiêu công việc được giao tại vị trí ${job.title}.\n` +
                  `• Phối hợp chặt chẽ cùng các phòng ban liên quan nhằm đảm bảo tiến độ và chất lượng dự án.\n` +
                  `• Đóng góp ý tưởng, cải tiến quy trình vận hành và nâng cao hiệu suất làm việc chung.\n` +
                  `• Thực hiện báo cáo định kỳ theo yêu cầu của cấp quản lý trực tiếp.`
                )}
              </div>
            </div>

            {/* Candidate Requirements */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Yêu cầu ứng viên
              </h4>
              <ul className="text-sm text-foreground/80 leading-relaxed space-y-1.5 list-disc list-inside bg-muted/20 p-4 rounded-xl border border-border/40">
                <li>Tốt nghiệp Cao đẳng / Đại học các chuyên ngành liên quan.</li>
                <li>Có tinh thần trách nhiệm cao, chủ động và ham học hỏi trong công việc.</li>
                <li>Kỹ năng giao tiếp tốt, khả năng làm việc độc lập và làm việc nhóm hiệu quả.</li>
                <li>Ưu tiên ứng viên có kinh nghiệm tương đương từ 6 tháng - 2 năm.</li>
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Quyền lợi & Đãi ngộ
              </h4>
              <ul className="text-sm text-foreground/80 leading-relaxed space-y-1.5 list-disc list-inside bg-muted/20 p-4 rounded-xl border border-border/40">
                <li>Mức thu nhập cạnh tranh: {formatSalary(job.salaryMin, job.salaryMax)}.</li>
                <li>Được đóng BHXH, BHYT, BHTN đầy đủ theo quy định của Luật Lao Động.</li>
                <li>Môi trường làm việc trẻ trung, năng động, khuyến khích sáng tạo cá nhân.</li>
                <li>Thưởng lễ tết, lương tháng 13, xét duyệt tăng lương định kỳ hằng năm.</li>
              </ul>
            </div>
          </>
        ) : (
          /* Company Info Tab */
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Giới thiệu về {job.companyName}</h4>
              <p className="text-sm text-foreground/80 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40">
                {job.companyIntro && job.companyIntro !== '<div>Chưa có giới thiệu</div>'
                  ? job.companyIntro.replace(/<[^>]*>?/gm, '')
                  : `${job.companyName} là một trong những doanh nghiệp uy tín hàng đầu trong lĩnh vực hoạt động. Với môi trường làm việc chuyên nghiệp, công ty luôn chú trọng đào tạo và phát triển tài năng trẻ.`}
              </p>
            </div>

            {job.companyAddress && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground p-3 rounded-xl bg-muted/30">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span><strong>Địa chỉ:</strong> {job.companyAddress}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 border-t border-border bg-card/95 backdrop-blur flex items-center gap-3">
        <Button
          onClick={() => navigate(`/job-posts/${job.id}`)}
          className="flex-1 bg-gradient-to-r from-beige-600 to-amber-600 hover:from-beige-700 hover:to-amber-700 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Ứng tuyển ngay
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate(`/job-posts/${job.id}`)}
          className="h-11 px-4 rounded-xl font-semibold border-border hover:bg-muted"
        >
          Trang chi tiết <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
