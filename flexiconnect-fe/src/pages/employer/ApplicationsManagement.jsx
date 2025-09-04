import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { authApis, endpoints } from "@configs/APIs";
import {
  Search, Filter, RotateCcw, Eye, Send, X, Clock, MapPin,
  CheckCircle, XCircle, Mail, FileText, Award, Calendar, User,
  ChevronDown
} from "lucide-react";
import { createPortal } from "react-dom";


const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Button = ({ children, variant = "default", size = "default", className = "", disabled, onClick, ...props }) => {
  const variants = {
    default: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700"
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3"
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        {children}
      </div>
    </div>
  );
};

const DropdownMenu = ({ trigger, children, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: align === "right" ? rect.right - 192 : rect.left
      });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="inline-block relative" ref={ref} onClick={toggleOpen}>
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-dropdown"
            style={{ top: coords.top, left: coords.left }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

const DropdownItem = ({ onClick, icon, children, variant = "default" }) => {
  const variants = {
    default: "text-gray-700 hover:bg-gray-50",
    success: "text-green-700 hover:bg-green-50",
    primary: "text-blue-700 hover:bg-blue-50",
    warning: "text-orange-700 hover:bg-orange-50",
    danger: "text-red-700 hover:bg-red-50",
    secondary: "text-gray-700 hover:bg-gray-50"
  };
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-150 ${variants[variant]}`}
    >
      {icon} {children}
    </button>
  );
};

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [emailDialog, setEmailDialog] = useState(null);
  const [emailPayload, setEmailPayload] = useState({
    interviewTime: "",
    location: "",
    result: "",
    documents: "",
    salary: "",
    startDate: ""
  });
  const [errors, setErrors] = useState({});

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (emailDialog?.actionType === "OFFER_LETTER") {
      if (!emailPayload.salary.trim()) {
        newErrors.salary = "Mức lương không được để trống";
      } else if (!/^\d+$/.test(emailPayload.salary.replace(/,/g, ""))) {
        newErrors.salary = "Mức lương chỉ được nhập số (vd: 12000000)";
      }
      if (!emailPayload.startDate) {
        newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
      }
    }

    if (emailDialog?.actionType === "INTERVIEW_INVITE") {
      if (!emailPayload.interviewTime.trim()) {
        newErrors.interviewTime = "Thời gian phỏng vấn không được để trống";
      } else {
        const interviewDate = new Date(emailPayload.interviewTime);
        const now = new Date();
        if (interviewDate < now) {
          newErrors.interviewTime = "Thời gian phỏng vấn không được trước thời điểm hiện tại";
        }
      }
      if (!emailPayload.location.trim()) {
        newErrors.location = "Vui lòng nhập link phỏng vấn online";
      }
    }

    if (emailDialog?.actionType === "INTERVIEW_RESULT") {
      if (!emailPayload.result.trim()) {
        newErrors.result = "Vui lòng nhập kết quả phỏng vấn";
      }
    }

    if (emailDialog?.actionType === "REQUEST_DOCUMENTS") {
      if (!emailPayload.documents.trim()) {
        newErrors.documents = "Vui lòng nhập danh sách giấy tờ cần bổ sung";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Fetch data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await authApis().get(endpoints["employer-applications"], {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  // ✅ Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const okStatus = statusFilter === "ALL" || a.status === statusFilter;
      if (!q) return okStatus;
      return (
        okStatus &&
        `${a.candidateName ?? ""} ${a.jobTitle ?? ""}`.toLowerCase().includes(q)
      );
    });
  }, [applications, query, statusFilter]);

  // ✅ Review action
  const review = async (id, status, rejectionReason = null) => {
    try {
      setSubmitting(true);
      const res = await authApis().put(
        `${endpoints["employer-applications"]}/${id}/review`,
        { status, reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data;
      setApplications((prev) =>
        prev.map((it) => (it.id === updated.id ? { ...it, ...updated } : it))
      );
      toast.success(status === "ACCEPTED" ? "✅ Đã duyệt hồ sơ" : "❌ Đã từ chối hồ sơ");
      setRejectingId(null);
      setReason("");
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Email sending
  const sendEmail = async () => {
    if (!emailDialog) return;
    try {
      await authApis().post(
        endpoints["employer-send-email"],
        { applicationId: emailDialog.appId, actionType: emailDialog.actionType, ...emailPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`📩 Đã gửi: ${emailDialog.actionType}`);
      setEmailDialog(null);
      setEmailPayload({ interviewTime: "", location: "", result: "", documents: "", salary: "", startDate: "" });
      setErrors({});
    } catch {
      toast.error("❌ Gửi email thất bại!");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return <Badge variant="pending">🕒 Chờ duyệt</Badge>;
      case "ACCEPTED": return <Badge variant="accepted">✅ Đã duyệt</Badge>;
      case "REJECTED": return <Badge variant="rejected">❌ Từ chối</Badge>;
      default: return <Badge>-</Badge>;
    }
  };

  const handleSend = () => {
    if (validate()) sendEmail();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý hồ sơ ứng tuyển</h1>

        {/* 🔎 Filter & Search */}
        <Card className="mb-6 p-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[180px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="ACCEPTED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
          <Button variant="default" onClick={fetchApplications} disabled={loading}>
            {loading ? "Đang tải..." : <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4" />Tải lại</div>}
          </Button>
        </Card>

        {/* 📋 Applications Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700"><div className="flex items-center gap-2"><User className="w-4 h-4" />Ứng viên</div></th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Vị trí</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Ngày nộp</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">CV</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">Không có hồ sơ phù hợp</td></tr>
                ) : filtered.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">{app.candidateName?.charAt(0) || "?"}</div>
                      <p className="font-medium text-gray-900">{app.candidateName}</p>
                    </td>

                    <td className="px-6 py-4">{app.jobTitle}</td>
                    
                    <td className="px-6 py-4 text-center">{app.appliedAt && new Date(app.appliedAt).toLocaleString("vi-VN")}</td>
                    <td className="px-6 py-4 text-center">
                      {app.resumeFile ? (
                        <a
                          href={app.resumeFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Xem CV (thêm đuôi .pft)
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-center">
                      {app.status === "PENDING" ? (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="flex gap-2">
                            <Button variant="success" size="sm" onClick={() => review(app.id, "ACCEPTED")}><CheckCircle className="w-4 h-4 mr-1" />Duyệt</Button>
                            <Button variant="danger" size="sm" onClick={() => setRejectingId(rejectingId === app.id ? null : app.id)}><XCircle className="w-4 h-4 mr-1" />Từ chối</Button>
                          </div>
                          {rejectingId === app.id && (
                            <Card className="p-4 w-72 animate-in slide-in-from-top-2">
                              <textarea placeholder="Nhập lý do từ chối..." className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent" rows={3} value={reason} onChange={e => setReason(e.target.value)} />
                              <div className="flex gap-2 mt-3">
                                <Button variant="danger" size="sm" className="flex-1" onClick={() => review(app.id, "REJECTED", reason.trim())} disabled={!reason.trim()}>Xác nhận</Button>
                                <Button variant="default" size="sm" onClick={() => setRejectingId(null)}>Hủy</Button>
                              </div>
                            </Card>
                          )}
                        </div>
                      ) : app.status === "ACCEPTED" ? (
                        <DropdownMenu trigger={<Button variant="secondary" size="sm">Thao tác <ChevronDown className="w-4 h-4 ml-1" /></Button>}>
                          <DropdownItem icon={<Calendar className="w-4 h-4" />} onClick={() => setEmailDialog({ appId: app.id, actionType: "INTERVIEW_INVITE" })}>Mời phỏng vấn</DropdownItem>
                          <DropdownItem icon={<CheckCircle className="w-4 h-4" />} onClick={() => setEmailDialog({ appId: app.id, actionType: "INTERVIEW_RESULT" })}>Kết quả phỏng vấn</DropdownItem>
                          <DropdownItem icon={<FileText className="w-4 h-4" />} onClick={() => setEmailDialog({ appId: app.id, actionType: "REQUEST_DOCUMENTS" })}>Bổ sung hồ sơ</DropdownItem>
                          <DropdownItem icon={<Award className="w-4 h-4" />} onClick={() => setEmailDialog({ appId: app.id, actionType: "OFFER_LETTER" })}>Mời nhận việc</DropdownItem>
                          <DropdownItem icon={<XCircle className="w-4 h-4" />} onClick={() => setEmailDialog({ appId: app.id, actionType: "INTERVIEW_CANCEL" })}>Hủy phỏng vấn</DropdownItem>
                        </DropdownMenu>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 📧 Email Dialog */}
        <Dialog open={!!emailDialog} onClose={() => setEmailDialog(null)}>
          <div className="p-6 w-[500px]">
            <div className="flex items-center justify-between mb-6">
              <Button variant="default" size="sm" onClick={() => setEmailDialog(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {/* INTERVIEW_INVITE */}
              {emailDialog?.actionType === "INTERVIEW_INVITE" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />Thời gian phỏng vấn
                    </label>
                    <input
                      type="datetime-local"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.interviewTime ? "border-red-500" : "border-gray-200"}`}
                      value={emailPayload.interviewTime}
                      onChange={(e) => setEmailPayload({ ...emailPayload, interviewTime: e.target.value })}
                    />
                    {errors.interviewTime && <p className="text-red-500 text-sm mt-1">{errors.interviewTime}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />Link phỏng vấn online
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.location ? "border-red-500" : "border-gray-200"}`}
                      value={emailPayload.location}
                      onChange={(e) => setEmailPayload({ ...emailPayload, location: e.target.value })}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </>
              )}

              {/* INTERVIEW_RESULT */}
              {emailDialog?.actionType === "INTERVIEW_RESULT" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-1" />Kết quả (Đậu / Rớt)
                  </label>
                  <select
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.result ? "border-red-500" : "border-gray-200"}`}
                    value={emailPayload.result}
                    onChange={(e) => setEmailPayload({ ...emailPayload, result: e.target.value })}
                  >
                    <option value="">-- Chọn kết quả --</option>
                    <option value="Đậu">Đậu</option>
                    <option value="Rớt">Rớt</option>
                  </select>
                  {errors.result && <p className="text-red-500 text-sm mt-1">{errors.result}</p>}
                </div>
              )}

              {/* REQUEST_DOCUMENTS */}
              {emailDialog?.actionType === "REQUEST_DOCUMENTS" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />Danh sách giấy tờ cần bổ sung...
                  </label>
                  <textarea
                    placeholder="Ví dụ: Bằng cấp, chứng chỉ, giấy khám sức khỏe..."
                    className={`w-full px-3 py-2.5 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 ${errors.documents ? "border-red-500" : "border-gray-200"}`}
                    rows={4}
                    value={emailPayload.documents}
                    onChange={(e) => setEmailPayload({ ...emailPayload, documents: e.target.value })}
                  />
                  {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
                </div>
              )}

              {/* OFFER_LETTER */}
              {emailDialog?.actionType === "OFFER_LETTER" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle className="w-4 h-4 inline mr-1" />Gửi thư mời nhận việc
                  </label>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương(triệu)</label>
                    <input
                      type="text"
                      value={emailPayload.salary || ""}
                      onChange={(e) => setEmailPayload({ ...emailPayload, salary: e.target.value })}
                      placeholder="VD: 15 "
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.salary ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu làm việc</label>
                    <input
                      type="date"
                      value={emailPayload.startDate || ""}
                      onChange={(e) => setEmailPayload({ ...emailPayload, startDate: e.target.value })}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.startDate ? "border-red-500" : "border-gray-200"}`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                </div>
              )}

              {/* INTERVIEW_CANCEL */}
              {emailDialog?.actionType === "INTERVIEW_CANCEL" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />Gửi thư hủy phỏng vấn
                  </label>
                  {/* Giữ nguyên UI, chưa có nội dung cụ thể */}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <Button variant="default" onClick={() => setEmailDialog(null)}>Hủy</Button>
              <Button variant="primary" onClick={handleSend}>
                <Send className="w-4 h-4 mr-2" />Gửi
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
