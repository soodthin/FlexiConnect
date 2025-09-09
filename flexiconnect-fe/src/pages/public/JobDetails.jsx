import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Bell,
  BellOff,
  Heart,
  HeartOff,
  MapPin,
  Clock,
  Eye,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Send,
  Share2,
  ArrowLeft,
  Shield,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";
import { endpoints, authApis } from "@configs/APIs";
import { MyUserContext } from "@contexts/MyContexts";
import ApplyDialog from "@applicationForms/ApplyDialog";
import parse from "html-react-parser";
import { toast } from "sonner";

const Card = ({ className = "", children, subtle = false }) => (
  <div className={`
    bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700
    ${subtle ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "primary", size = "md", loading = false, ...props }) => {
  const variants = {
    primary: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600",
    success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3"
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
};


const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
  };

  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color = "gray" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2">
      <Icon size={16} className={`text-${color}-600 dark:text-${color}-400`} />
      <div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
      </div>
    </div>
  </div>
);

const JobStatus = ({ daysLeft }) => {
  if (daysLeft === null) return null;

  const getStatusConfig = () => {
    if (daysLeft <= 0) return { variant: "danger", icon: AlertCircle, text: "Đã hết hạn" };
    if (daysLeft <= 3) return { variant: "warning", icon: Timer, text: `Còn ${daysLeft} ngày` };
    if (daysLeft <= 7) return { variant: "info", icon: Clock, text: `Còn ${daysLeft} ngày` };
    return { variant: "success", icon: CheckCircle, text: `Còn ${daysLeft} ngày` };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      <config.icon size={12} />
      {config.text}
    </Badge>
  );
};

const getSalaryText = (min, max) => (min && max ? `${min} - ${max} triệu` : "Thương lượng");

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const myUser = useContext(MyUserContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [notifyJob, setNotifyJob] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    save: false,
    follow: false,
    notify: false
  });

  const loadJobData = async () => {
    try {
      const res = await authApis().get(endpoints["jobpost-id"](id));
      const data = res.data;
      setJob(data);

      if (initialLoad) {
        setIsFollowed(data.isFollowed ?? false);
        setNotifyJob(data.notifyJob ?? false);

        if (myUser) {
          try {
            const checkRes = await authApis().post(endpoints["saved-job-check"], {
              jobPostId: data.id
            });
            if (checkRes.data.success) {
              setIsSaved(checkRes.data.isSaved);
            } else {
              setIsSaved(false);
            }
          } catch (err) {
            console.error("Check saved job failed:", err);
            setIsSaved(false);
          }
        } else {
          setIsSaved(false);
        }

        setInitialLoad(false);
      }
    } catch (err) {
      console.error(err);
      navigate("/job-posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
  }, [id, navigate]);

  const requireLogin = () => {
    if (!myUser) {
      toast.message("Vui lòng đăng nhập để thực hiện hành động này.");
      return false;
    }
    return true;
  };

  const handleFollowToggle = async () => {
    if (!job || !requireLogin()) return;
    setActionLoading(prev => ({ ...prev, follow: true }));
    try {
      if (!isFollowed) {
        await authApis().post(endpoints["follow-employer"], { employerId: job.employerId });
        await authApis().patch(endpoints["notify-employer"], { employerId: job.employerId, notifyJob: true });
        setNotifyJob(true);
      } else {
        await authApis().delete(endpoints["unfollow-employer"], { data: { employerId: job.employerId } });
        setNotifyJob(false);
      }
      setIsFollowed(!isFollowed);
    } catch (err) {
      console.error("Follow toggle thất bại:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, follow: false }));
    }
  };

  const handleToggleNotify = async () => {
    if (!job || !requireLogin()) return;
    setActionLoading(prev => ({ ...prev, notify: true }));
    try {
      await authApis().patch(endpoints["notify-employer"], { employerId: job.employerId, notifyJob: !notifyJob });
      setNotifyJob(!notifyJob);
    } catch (err) {
      console.error("Toggle notify thất bại:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, notify: false }));
    }
  };

  const handleSaveJob = async () => {
    if (!job || !requireLogin()) return;
    setActionLoading(prev => ({ ...prev, save: true }));
    try {
      const res = await authApis().post(endpoints["saved-job"], { jobPostId: job.id });
      const data = res.data;

      if (data.success) {
        setIsSaved(data.isSaved);
      } else {
        console.error("Toggle save job thất bại:", data.message);
        alert(data.message);
      }
    } catch (err) {
      console.error("Toggle save job thất bại:", err);
      alert("Có lỗi xảy ra khi lưu/ bỏ lưu job!");
    } finally {
      setActionLoading(prev => ({ ...prev, save: false }));
    }
  };


  const handleApplyClick = () => {
    if (!requireLogin()) return;
    setIsApplyOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-60 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;


  const salaryText = getSalaryText(job.salaryMin, job.salaryMax);
  const daysLeft = job.expiredAt
    ? Math.max(0, Math.ceil((new Date(job.expiredAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (

    <>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} />
                Quay lại
              </Button>

              <div className="flex items-center gap-3">
                <JobStatus daysLeft={daysLeft} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="info">
                    <Building2 size={12} />
                    {job.jobType || 'Full-time'}
                  </Badge>
                  <Badge variant="default">
                    <MapPin size={12} />
                    {job.location}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {job.title}
                </h1>

                <div className="flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-green-500 mb-6">
                  <DollarSign size={24} />
                  <span>{salaryText}</span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={Eye} label="Lượt xem" value={job.viewCount ?? 0} color="blue" />
                  <StatCard icon={Users} label="Ứng viên" value="12+" color="green" />
                  <StatCard
                    icon={Calendar}
                    label="Ngày đăng"
                    value={job.createdAt ? new Date(job.expiredAt).toLocaleString('vi-VN', { hour12: false }) : '-'}
                    color="gray"
                  />
                  <StatCard
                    icon={Calendar}
                    label="Hết hạn"
                    value={job.expiredAt ? new Date(job.expiredAt).toLocaleString('vi-VN', { hour12: false }) : '-'}
                    color="gray"
                  />

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleApplyClick}
                  >
                    <Send size={16} />
                    Ứng tuyển ngay
                  </Button>

                  <Button
                    variant={isSaved ? "success" : "outline"}
                    size="lg"
                    onClick={handleSaveJob}
                    loading={actionLoading.save}
                  >
                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    {isSaved ? "Đã lưu" : "Lưu Job"}
                  </Button>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Mô tả công việc
                  </h2>
                </div>

                {/* Company Intro */}
                {job.companyIntro && (
                  <Card subtle className="p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Building2 size={18} className="text-blue-600" />
                      Giới thiệu công ty
                    </h3>

                    <div className="prose dark:prose-invert max-w-none">
                      {parse(job.companyIntro, {
                        replace: (domNode) => {
                          // Chỉ xử lý div có class "company-gallery"
                          if (domNode.name === "div" && domNode.attribs?.class === "company-gallery") {
                            return (
                              <div className="grid grid-cols-3 gap-2">
                                {domNode.children.map((imgNode, index) => {
                                  if (imgNode.name === "img") {
                                    return (
                                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                                        <img
                                          src={imgNode.attribs.src}
                                          alt={imgNode.attribs.alt || "company image"}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            );
                          }
                        },
                      })}
                    </div>
                  </Card>
                )}




                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Card */}
              <Card className="p-6 text-center">
                {/* Company Logo */}
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {job.avatar ? (
                      <img
                        src={job.avatar}
                        alt="company logo"
                        className="w-14 h-14 object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 size={24} className="text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Star size={10} className="text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {job.companyName}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Công ty công nghệ hàng đầu
                </p>

                {/* Company Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">50+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Nhân viên</div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant={isFollowed ? "danger" : "primary"}
                    onClick={handleFollowToggle}
                    loading={actionLoading.follow}
                    className="w-full"
                    size="sm"
                  >
                    {isFollowed ? <Heart size={14} /> : <HeartOff size={14} />}
                    {isFollowed ? "Đang Follow" : "Follow công ty"}
                  </Button>

                  {isFollowed && (
                    <Button
                      variant={notifyJob ? "success" : "secondary"}
                      onClick={handleToggleNotify}
                      loading={actionLoading.notify}
                      className="w-full"
                      size="sm"
                    >
                      {notifyJob ? <Bell size={14} /> : <BellOff size={14} />}
                      {notifyJob ? "Đang thông báo" : "Bật thông báo"}
                    </Button>
                  )}
                </div>
              </Card>


              {/* Similar Jobs */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-500" size={18} />
                  Việc làm khác
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-sm">Senior React Developer</div>
                    <div className="text-xs text-gray-500">ABC Company • 20-25 triệu</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-sm">Marketing</div>
                    <div className="text-xs text-gray-500">Shopee • 18-22 triệu</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ApplyDialog isOpen={isApplyOpen} setIsOpen={setIsApplyOpen} jobId={job.id} />
    </>
  );
}