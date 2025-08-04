import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { EyeOpenIcon, Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
const statusColors = {
  PENDING: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusText = {
  PENDING: "⏳ Chờ duyệt",
  ACCEPTED: "✔️ Đã duyệt",
  REJECTED: "❌ Từ chối",
};

export default function RecruiterApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await authApis().get(endpoints["applications"]);
        setApplications(res.data);
      } catch (err) {
        toast.error("Không thể tải danh sách ứng viên");
        console.error("Lỗi khi fetch ứng viên:", err);
      }
    };

    fetchApplications();
  }, []);

  const filtered = applications.filter(
    (a) =>
      (!filter || a.status === filter) &&
      (!search || a.candidateName.toLowerCase().includes(search.toLowerCase()))
  );


  const handleReview = async () => {
    try {
      const body = {
        status: reviewing.status,
        reason: reviewing.status === "REJECTED" ? reason : null,
      };

      await authApis().put(
        endpoints["review-application"](reviewing.id),
        body
      );

      setApplications((prev) =>
        prev.map((a) =>
          a.id === reviewing.id
            ? { ...a, status: reviewing.status, rejectionReason: body.reason }
            : a
        )
      );

      setReviewing(null);
      setReason("");
    } catch (err) {
      console.error("Lỗi khi duyệt hồ sơ:", err);
      toast.error("Duyệt hồ sơ thất bại");
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">📋 Hồ sơ ứng viên</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="ACCEPTED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>

        <input
          placeholder="Tìm theo tên ứng viên..."
          className="border rounded px-3 py-2 text-sm flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Ứng viên</th>
            <th className="p-2">Vị trí</th>
            <th className="p-2">Ngày ứng tuyển</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-400">
                Không có hồ sơ phù hợp.
              </td>
            </tr>
          ) : (
            filtered.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.candidateName}</td>
                <td className="p-2">{a.jobPostTitle}</td>
                <td className="p-2">{new Date(a.appliedAt).toLocaleDateString()}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full ${statusColors[a.status]} text-xs`}>
                    {statusText[a.status]}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-600 underline text-sm"
                    onClick={() => setSelected(a)}
                  >
                    <EyeOpenIcon className="inline-block w-4 h-4 mr-1" />
                    Xem
                  </button>

                  {a.status === "PENDING" && (
                    <>
                      <button
                        className="text-green-600 hover:underline text-sm"
                        onClick={() => setReviewing({ ...a, status: "ACCEPTED" })}
                      >
                        ✔️ Duyệt
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => setReviewing({ ...a, status: "REJECTED" })}
                      >
                        ❌ Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal xem hồ sơ */}
      <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
          <Dialog.Content className="fixed top-[10%] left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow w-full max-w-xl">
            {selected && (
              <>
                <h3 className="text-xl font-semibold mb-2">{selected.candidateName}</h3>
                <p className="mb-1">
                  <strong>Vị trí:</strong> {selected.jobPostTitle}
                </p>
                <p className="mb-1">
                  <strong>Ngày ứng tuyển:</strong>{" "}
                  {new Date(selected.appliedAt).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Thư giới thiệu:</strong>{" "}
                  {selected.coverLetter || (
                    <span className="italic text-gray-500">Không có</span>
                  )}
                </p>
                <p className="mb-1">
                  <strong>CV:</strong>{" "}
                  {selected.resumeFile ? (
                    <a
                      href={selected.resumeFile}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Xem CV
                    </a>
                  ) : (
                    <span className="italic text-gray-500">Không có</span>
                  )}
                </p>
                {selected.status === "REJECTED" && selected.rejectionReason && (
                  <p className="mt-2 text-red-600">
                    <strong>Lý do từ chối:</strong> {selected.rejectionReason}
                  </p>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!reviewing} onOpenChange={() => setReviewing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-[10%] left-1/2 -translate-x-1/2 bg-white p-6 rounded shadow w-full max-w-md">
            {reviewing && (
              <>
                <h3 className="text-lg font-bold mb-4">
                  {reviewing.status === "ACCEPTED" ? "Duyệt hồ sơ" : "Từ chối hồ sơ"}
                </h3>
                <p className="mb-2">
                  Ứng viên: <strong>{reviewing.candidateName}</strong>
                </p>
                <p className="mb-2">
                  Vị trí: <strong>{reviewing.jobPostTitle}</strong>
                </p>
                {reviewing.status === "REJECTED" && (
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Lý do từ chối:</label>
                    <input
                      type="text"
                      className="border px-3 py-2 rounded w-full text-sm"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReviewing(null)}
                    className="text-sm border px-3 py-1 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleReview}
                    className="text-sm px-3 py-1 rounded bg-blue-600 text-white disabled:bg-blue-300"
                    disabled={reviewing.status === "REJECTED" && !reason}
                  >
                    Xác nhận
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
