import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

function EmployerManagement() {
  const [employers, setEmployers] = useState([]);
  const [open, setOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark"
    );
  }, []);

  const loadEmployers = async () => {
    try {
      const res = await authApis().get(endpoints["admin-employers"]);
      setEmployers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Lỗi load danh sách!");
    }
  };

  useEffect(() => { loadEmployers(); }, []);

  const handleVerify = async (id) => {
    try {
      await authApis().put(endpoints["admin-employer-verify"](id));
      toast.success("Duyệt thành công!");
      await loadEmployers();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to verify!");
    }
  };

  const handleRejectSubmit = async () => {
    if (!reason.trim()) {
      toast.error("⚠️ Vui lòng nhập lý do!");
      return;
    }
    try {
      await authApis().put(endpoints["admin-employer-reject"](rejectId), { reason });
      toast.error(` Từ chối thành công, lý do: ${reason}`);
      await loadEmployers();
      setOpen(false);
      setReason("");
      setRejectId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to reject!");
    }
  };

  const pending = employers.filter((e) => !e.isVerified && !e.reasonReject);
  const approved = employers.filter((e) => e.isVerified);
  const rejected = employers.filter((e) => !e.isVerified && e.reasonReject);

  const renderTable = (list, showActions = false, showReason = false) => (
    <div className="overflow-x-auto border rounded-lg mt-4 shadow-sm dark:border-dark-border-primary">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-neutral-100 dark:bg-dark-bg-tertiary text-neutral-700 dark:text-neutral-200">
          <tr>
            <th className="p-3 text-left">Tên công ty</th>
            <th className="p-3 text-left">Mã số thuế</th>
            <th className="p-3 text-left">Website</th>
            <th className="p-3 text-left">Địa chỉ</th>
            {showReason && <th className="p-3 text-left text-red-600 dark:text-red-400">Lý do từ chối</th>}
            {showActions && <th className="p-3 text-left">Chức năng</th>}
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? list.map((emp) => (
            <tr key={emp.id} className="border-t hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
              <td className="p-3 font-medium">{emp.companyName}</td>
              <td className="p-3">{emp.taxCode}</td>
              <td className="p-3">
                <a href={emp.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {emp.website}
                </a>
              </td>
              <td className="p-3">{emp.companyAddress}</td>
              {showReason && <td className="p-3 text-red-600 dark:text-red-400 font-medium italic">{emp.reasonReject}</td>}
              {showActions && (
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => handleVerify(emp.id)}
                    className="px-4 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow hover:scale-105 transform transition"
                  >
                     Verify
                  </button>
                  <button
                    onClick={() => { setRejectId(emp.id); setOpen(true); }}
                    className="px-4 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow hover:scale-105 transform transition"
                  >
                     Reject
                  </button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan={5 + (showReason ? 1 : 0) + (showActions ? 1 : 0)} className="text-center p-6 text-neutral-500 dark:text-neutral-400 italic">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-beige-light dark:bg-dark-bg-primary text-neutral-800 dark:text-neutral-100">
      <h2 className="text-2xl font-bold mb-6">TRANG DUYỆT NHÀ TUYỂN DỤNG</h2>

      <Tabs.Root defaultValue="pending">
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4 dark:border-dark-border-primary">
          <Tabs.Trigger value="pending" className="px-4 py-2 data-[state=active]:border-b-2 border-blue-500 font-medium">
            Chờ duyệt <span className="ml-1 text-blue-600 dark:text-blue-400">({pending.length})</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="approved" className="px-4 py-2 data-[state=active]:border-b-2 border-green-500 font-medium">
            Đã duyệt <span className="ml-1 text-green-600 dark:text-green-400">({approved.length})</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="rejected" className="px-4 py-2 data-[state=active]:border-b-2 border-red-500 font-medium">
            Bị từ chối <span className="ml-1 text-red-600 dark:text-red-400">({rejected.length})</span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pending">{renderTable(pending, true)}</Tabs.Content>
        <Tabs.Content value="approved">{renderTable(approved)}</Tabs.Content>
        <Tabs.Content value="rejected">{renderTable(rejected, false, true)}</Tabs.Content>
      </Tabs.Root>

      {/* Dialog reject hiện đại */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[480px] max-w-full -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold text-red-600 dark:text-red-400">
              🚫 Từ chối nhà tuyển dụng
            </Dialog.Title>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              Vui lòng nhập lý do từ chối để thông báo cho nhà tuyển dụng.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 dark:bg-neutral-700 dark:border-dark-border-subtle dark:text-neutral-100 resize-none"
              rows={5}
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-neutral-200 dark:bg-[#444] rounded-full hover:bg-neutral-300 dark:hover:bg-[#555] transition">
                  Hủy
                </button>
              </Dialog.Close>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow hover:scale-105 transform transition"
              >
                Xác nhận từ chối
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default EmployerManagement;
