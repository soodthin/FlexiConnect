import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authApis, endpoints } from "@configs/APIs";

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const okStatus = statusFilter === "ALL" || a.status === statusFilter;
      if (!q) return okStatus;
      const hay = `${a.candidateName ?? ""} ${a.jobTitle ?? ""}`.toLowerCase();
      return okStatus && hay.includes(q);
    });
  }, [applications, query, statusFilter]);

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
        status === "ACCEPTED" ? "Đã duyệt hồ sơ" : "Đã từ chối hồ sơ"
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
                  <td className="px-3 py-2 space-x-2">
                    {app.status === "PENDING" ? (
                      <>
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
                      </>
                    ) : app.status === "REJECTED" ? (
                      <span className="text-red-600">
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
    </div>
  );
}
