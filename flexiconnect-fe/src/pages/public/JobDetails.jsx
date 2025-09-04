import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Bell, BellOff, Heart, HeartOff } from "lucide-react";
import { endpoints, authApis } from "@configs/APIs";
import { MyUserContext } from "@contexts/MyContexts";
import ApplyDialog from "@applicationForms/ApplyDialog";

const Card = ({ className = "", children }) => (
  <div className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-md ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const base = "rounded-lg font-semibold transition flex items-center justify-center gap-2";
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-yellow-500 dark:text-black",
    outline: "border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-neutral-700",
    danger: "bg-red-50 border border-red-300 text-red-600 hover:opacity-90",
    success: "bg-green-50 border border-green-300 text-green-600 hover:opacity-90",
    info: "bg-blue-50 border border-blue-300 text-blue-600 hover:opacity-90",
    ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-700",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
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

  const loadJobData = async () => {
    try {
      const res = await authApis().get(endpoints["jobpost-id"](id));
      const data = res.data;
      setJob(data);
      console.log(data);

      if (initialLoad) {
        setIsFollowed(data.isFollowed ?? false);
        setNotifyJob(data.notifyJob ?? false);
        setIsSaved(data.isSaved ?? false);
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
      alert("Bạn cần đăng nhập để sử dụng chức năng này");
      return false;
    }
    return true;
  };

  const handleFollowToggle = async () => {
    if (!job || !requireLogin()) return;
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
    }
  };

  const handleToggleNotify = async () => {
    if (!job || !requireLogin()) return;
    try {
      await authApis().patch(endpoints["notify-employer"], { employerId: job.employerId, notifyJob: !notifyJob });
      setNotifyJob(!notifyJob);
    } catch (err) {
      console.error("Toggle notify thất bại:", err);
    }
  };

  const handleSaveJob = async () => {
    if (!job || !requireLogin()) return;
    try {
      if (!isSaved) {
        await authApis().post(endpoints["save-job"], { jobId: job.id });
        setIsSaved(true);
      } else {
        await authApis().delete(endpoints["un-save-job"], { data: { jobId: job.id } });
        setIsSaved(false);
      }
    } catch (err) {
      console.error("Toggle save job thất bại:", err);
    }
  };

  const handleApplyClick = () => {
    if (!requireLogin()) return;
    setIsApplyOpen(true);
  };

  if (loading) return <div className="text-center p-10">Đang tải...</div>;
  if (!job) return null;

  const salaryText = getSalaryText(job.salaryMin, job.salaryMax);
  const daysLeft = job.expiredAt
    ? Math.max(0, Math.ceil((new Date(job.expiredAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <div className="flex justify-center py-10 bg-neutral-100 dark:bg-neutral-900 min-h-screen">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-8">
          {/* LEFT: Job info */}
          <div className="flex-1 space-y-6">
            <Card className="p-8">
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="text-orange-500 font-semibold mb-3">{salaryText}</div>
              <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-5">
                {daysLeft !== null && <span>Hết hạn sau {daysLeft} ngày</span>}
                <span>{job.viewCount ?? 0} lượt xem</span>
                <span>{job.location}</span>
              </div>
              <div className="flex gap-3 mt-5">
                <Button className="flex-1 py-3 text-lg" onClick={handleApplyClick}>
                  Ứng tuyển ngay
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-lg"
                  onClick={handleSaveJob}
                >
                  {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  {isSaved ? "Bỏ lưu" : "Lưu Job"}
                </Button>
              </div>
            </Card>

            <Card className="p-8">

              {/* Nếu có company_intro, hiển thị ảnh */}
{job.companyIntro && (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "16px",
      overflowX: "auto"
    }}
    dangerouslySetInnerHTML={{ __html: job.companyIntro }}
  />
)}


              <h2 className="text-xl font-bold mb-3">Mô tả công việc</h2>
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-200">
                {job.description}
              </div>
            </Card>
          </div>

          {/* RIGHT: Company info */}
          <div className="w-full lg:w-96 space-y-6">
            <Card className="p-6 pt-16 relative text-center">
              {job.avatar && (
                <img
                  src={job.avatar}
                  alt="logo"
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 object-contain rounded-lg"
                />
              )}
              <div className="mt-10 font-semibold text-lg">{job.companyName}</div>

              <div className="flex justify-center gap-3 mt-4">
                <Button
                  variant={isFollowed ? "danger" : "info"}
                  onClick={handleFollowToggle}
                  className="px-3 py-1 text-sm"
                >
                  {isFollowed ? <Heart size={14} /> : <HeartOff size={14} />}
                  {isFollowed ? "Đang Follow" : "Follow"}
                </Button>

                {isFollowed && (
                  <Button
                    variant={notifyJob ? "success" : "outline"}
                    onClick={handleToggleNotify}
                    className="px-3 py-1 text-sm"
                  >
                    {notifyJob ? <Bell size={14} /> : <BellOff size={14} />}
                    {notifyJob ? "Thông báo" : "Tắt báo"}
                  </Button>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>

      <ApplyDialog isOpen={isApplyOpen} setIsOpen={setIsApplyOpen} jobId={job.id} />
    </>
  );
}
