import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import { UserRound, Briefcase, MapPin, Clock, DollarSign, AlertTriangle } from "lucide-react";
import ConfirmationDialog from "@components/confirm/ConfirmationDialog";
const Card = ({ children, className = "" }) => (
  <div className={`p-6 rounded-xl shadow-sm border bg-white dark:bg-dark-bg-secondary hover:shadow-md transition ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`text-sm text-neutral-700 dark:text-neutral-300 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>{children}</span>
);

const Separator = () => <div className="bg-neutral-200 dark:bg-neutral-700 h-px w-full mb-4" />;

const Avatar = ({ src, alt, fallback }) => (
  <div className="w-12 h-12 rounded-full overflow-hidden border shadow flex items-center justify-center bg-neutral-200 dark:bg-neutral-600 text-sm font-medium text-neutral-700 dark:text-neutral-200">
    {src ? <img src={src} alt={alt} className="w-full h-full object-cover" /> : fallback}
  </div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`flex items-center justify-end mt-4 ${className}`}>{children}</div>
);

const Applied = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);


  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await authApis().get(endpoints["candidate-applied"]);
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Không thể tải danh sách ứng tuyển!");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      case "WITHDRAWN":
        return "bg-neutral-200 text-neutral-600 border border-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600";
      default:
        return "bg-neutral-100 text-neutral-800 border border-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600";
    }
  };

  const parseDescription = (description) => {
    if (!description) return [];

    return description
      .split("\n")
      .map((line, index) => {
        const [key, value] = line.split(":").map((s) => s.trim());
        if (!key || !value) return null;
        return { key, value, id: `${key}-${index}` };
      })
      .filter(Boolean);
  };

  const openConfirmationDialog = (applicationId) => {
    setSelectedAppId(applicationId);
    setIsDialogOpen(true);
  };
  const confirmWithdraw = async () => {
    if (!selectedAppId) return;

    try {
      await authApis().put(endpoints["withdraw-application"](selectedAppId));
      setApplications(prevApps =>
        prevApps.map(app =>
          app.id === selectedAppId ? { ...app, status: 'WITHDRAWN' } : app
        )
      );
      toast.success("Rút hồ sơ thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi, không thể rút hồ sơ. Vui lòng thử lại.");
    } finally {
      // Đóng dialog và reset state sau khi hoàn tất
      setIsDialogOpen(false);
      setSelectedAppId(null);
    }
  };


  if (loading) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }
  return (
    <div className="p-8 min-h-screen bg-neutral-50 dark:bg-dark-bg-primary">
      <h2 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
        Hồ sơ đã ứng tuyển
      </h2>

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id}>
              {/* Header */}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={app.companyLogo}
                    alt={app.companyName}
                    fallback={app.companyName?.[0] || <UserRound size={16} />}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      {app.jobPostTitle || app.jobTitle}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {app.companyName}
                    </p>
                  </div>
                </div>

                <Badge className={statusStyle(app.status)}>{app.status}</Badge>
              </CardHeader>

              <Separator />

              {/* Body */}
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neutral-500" />
                    <p className="font-medium">{app.location || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-neutral-500" />
                    <p className="font-medium">{app.jobType || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-neutral-500" />
                    <p className="font-medium">
                      {app.salaryMin && app.salaryMax
                        ? `${app.salaryMin} - ${app.salaryMax} triệu`
                        : "Thỏa thuận"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-neutral-500" />
                    <p className="font-medium">
                      {new Date(app.appliedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Extra info */}
                <div className="mt-4 space-y-2">
                  {app.coverLetter && (
                    <p className="italic text-neutral-500">“{app.coverLetter}”</p>
                  )}

                  {app.rejectionReason && (
                    <p className="text-red-500 font-medium">
                      Lý do từ chối: {app.rejectionReason}
                    </p>
                  )}

                  {app.description && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {parseDescription(app.description).map(({ key, value, id }) => (
                        <div key={id}>
                          <p className="text-neutral-500 dark:text-neutral-400">{key}</p>
                          <p className="font-medium dark:text-neutral-200">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              {(app.status === "PENDING" || app.status === "ACCEPTED") && (
                <CardFooter>
                  <button
                      onClick={() => openConfirmationDialog(app.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900"
                    >
                    <AlertTriangle size={14} />
                    Rút hồ sơ
                  </button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500 italic">Chưa có hồ sơ nào</p>
      )}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmWithdraw}
        title="Xác nhận rút hồ sơ"
        message="Bạn có chắc chắn muốn rút hồ sơ này không? Hành động này không thể hoàn tác và nhà tuyển dụng sẽ được thông báo."
      />
    </div>
  );
};

export default Applied;
