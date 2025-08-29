import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authApis, endpoints } from "@configs/APIs";

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Email logs
  const [logs, setLogs] = useState([]);
  const [logAppId, setLogAppId] = useState(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Modal gửi email
  const [emailDialog, setEmailDialog] = useState(null); // { appId, actionType }
  const [emailPayload, setEmailPayload] = useState({
    interviewTime: "",
    location: "",
    result: "",
    documents: ""
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Lấy danh sách ứng viên
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await authApis().get(endpoints["employer-applications"], {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Lọc theo từ khóa + trạng thái
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const okStatus = statusFilter === "ALL" || a.status === statusFilter;
      if (!q) return okStatus;
      const hay = `${a.candidateName ?? ""} ${a.jobTitle ?? ""}`.toLowerCase();
      return okStatus && hay.includes(q);
    });
  }, [applications, query, statusFilter]);

  // Duyệt / từ chối hồ sơ
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

      toast.success(
        status === "ACCEPTED" ? "✅ Đã duyệt hồ sơ" : "❌ Đã từ chối hồ sơ"
      );

      setRejectingId(null);
      setReason("");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // Gửi email
  const sendEmail = async () => {
    if (!emailDialog) return;
    try {
      await authApis().post(
        endpoints["employer-send-email"],
        {
          applicationId: emailDialog.appId,
          actionType: emailDialog.actionType,
          ...emailPayload,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`📩 Đã gửi: ${emailDialog.actionType}`);
      setEmailDialog(null);
      setEmailPayload({ interviewTime: "", location: "", result: "", documents: "" });
    } catch (err) {
      console.error(err);
      toast.error("❌ Gửi email thất bại!");
    }
  };

  // 📌 Lấy email logs theo applicationId
  const fetchLogs = async (applicationId) => {
    try {
      setLoadingLogs(true);
      const res = await authApis().get(
        `${endpoints["employer-email-logs"].replace(":id", applicationId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(Array.isArray(res.data) ? res.data : []);
      setLogAppId(applicationId);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải lịch sử email");
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📂 Quản lý hồ sơ ứng tuyển</h2>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên / chức danh"
          className="border px-3 py-1 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="ACCEPTED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
        <button
          onClick={fetchApplications}
          className="bg-gray-200 px-3 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Ứng viên</th>
              <th className="px-3 py-2 text-left">Vị trí</th>
              <th className="px-3 py-2">Ngày nộp</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Không có hồ sơ phù hợp
                </td>
              </tr>
            ) : (
              filtered.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-3 py-2">{app.candidateName}</td>
                  <td className="px-3 py-2">{app.jobTitle}</td>
                  <td className="px-3 py-2">
                    {app.appliedAt &&
                      new Date(app.appliedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2">{app.status}</td>
                  <td className="px-3 py-2 space-y-2">
                    {/* Nếu đang chờ duyệt */}
                    {app.status === "PENDING" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => review(app.id, "ACCEPTED")}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          disabled={submitting}
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() =>
                            setRejectingId(
                              rejectingId === app.id ? null : app.id
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          disabled={submitting}
                        >
                          Từ chối
                        </button>
                        {rejectingId === app.id && (
                          <div className="mt-2">
                            <textarea
                              placeholder="Nhập lý do từ chối..."
                              className="border rounded w-full px-2 py-1"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() =>
                                  review(app.id, "REJECTED", reason.trim())
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded"
                                disabled={submitting || !reason.trim()}
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => setRejectingId(null)}
                                className="bg-gray-200 px-3 py-1 rounded"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : app.status === "ACCEPTED" ? (
                      // Nếu đã duyệt => hiển thị nút gửi mail + xem log
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            setEmailDialog({ appId: app.id, actionType: "INTERVIEW_INVITE" })
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mời PV
                        </button>
                        <button
                          onClick={() =>
                            setEmailDialog({ appId: app.id, actionType: "INTERVIEW_RESULT" })
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          KQ PV
                        </button>
                        <button
                          onClick={() =>
                            setEmailDialog({ appId: app.id, actionType: "REQUEST_DOCUMENTS" })
                          }
                          className="bg-orange-500 text-white px-3 py-1 rounded"
                        >
                          Bổ sung HS
                        </button>
                        <button
                          onClick={() =>
                            setEmailDialog({ appId: app.id, actionType: "OFFER_LETTER" })
                          }
                          className="bg-purple-600 text-white px-3 py-1 rounded"
                        >
                          Offer
                        </button>
                        <button
                          onClick={() =>
                            setEmailDialog({ appId: app.id, actionType: "INTERVIEW_CANCEL" })
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Hủy PV
                        </button>
                        <button
                          onClick={() => fetchLogs(app.id)}
                          className="bg-gray-700 text-white px-3 py-1 rounded"
                        >
                          📑 Xem log
                        </button>
                      </div>
                    ) : app.status === "REJECTED" ? (
                      <span className="text-red-600 text-sm">
                        ❌ {app.rejectionReason}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal logs */}
      {logAppId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-3">
              📑 Lịch sử email (Application #{logAppId})
            </h3>
            {loadingLogs ? (
              <p>⏳ Đang tải...</p>
            ) : logs.length === 0 ? (
              <p className="text-gray-500">Chưa có email nào được gửi</p>
            ) : (
              <ul className="space-y-2">
                {logs.map((log) => (
                  <li key={log.id} className="border rounded p-2">
                    <p>
                      <b>{log.actionType}</b> -{" "}
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-600">{log.subject}</p>
                    <div
                      className="text-sm mt-1 border-t pt-1"
                      dangerouslySetInnerHTML={{ __html: log.content }}
                    />
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setLogAppId(null)}
              className="mt-3 bg-gray-300 px-3 py-1 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal gửi email */}
      {emailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-[500px]">
            <h3 className="text-lg font-bold mb-3">
              📩 Gửi email: {emailDialog.actionType}
            </h3>

            {emailDialog.actionType === "INTERVIEW_INVITE" && (
              <>
                <input
                  type="text"
                  placeholder="⏰ Thời gian phỏng vấn"
                  className="border px-2 py-1 w-full mb-2"
                  value={emailPayload.interviewTime}
                  onChange={(e) =>
                    setEmailPayload({ ...emailPayload, interviewTime: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="📍 Địa điểm / link online"
                  className="border px-2 py-1 w-full mb-2"
                  value={emailPayload.location}
                  onChange={(e) =>
                    setEmailPayload({ ...emailPayload, location: e.target.value })
                  }
                />
              </>
            )}

            {emailDialog.actionType === "INTERVIEW_RESULT" && (
              <input
                type="text"
                placeholder="✅ Kết quả (Đậu / Rớt)"
                className="border px-2 py-1 w-full mb-2"
                value={emailPayload.result}
                onChange={(e) =>
                  setEmailPayload({ ...emailPayload, result: e.target.value })
                }
              />
            )}

            {emailDialog.actionType === "REQUEST_DOCUMENTS" && (
              <textarea
                placeholder="📄 Danh sách giấy tờ cần bổ sung..."
                className="border px-2 py-1 w-full mb-2"
                value={emailPayload.documents}
                onChange={(e) =>
                  setEmailPayload({ ...emailPayload, documents: e.target.value })
                }
              />
            )}

            {/* Offer và Cancel thì có thể không cần thêm field */}

            <div className="flex gap-2 justify-end mt-3">
              <button
                onClick={sendEmail}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Gửi
              </button>
              <button
                onClick={() => setEmailDialog(null)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
