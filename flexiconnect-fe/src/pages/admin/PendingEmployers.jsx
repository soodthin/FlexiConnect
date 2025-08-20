import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

function EmployerManagement() {
  const [employers, setEmployers] = useState([]);
  const [open, setOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");

  // 🔹 load tất cả employers
  const loadEmployers = async () => {
    try {
      const res = await authApis().get(endpoints["admin-employers"]);
      setEmployers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Lỗi load danh sách!");
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  // 🔹 xác nhận duyệt
  const handleVerify = async (id) => {
    try {
      await authApis().put(endpoints["admin-employer-verify"](id));
      toast.success("✅ Duyệt thành công!");
      await loadEmployers(); // reload lại toàn bộ để đồng bộ
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to verify!");
    }
  };

  // 🔹 từ chối
  const handleRejectSubmit = async () => {
    if (!reason.trim()) {
      toast.error("⚠️ Vui lòng nhập lý do!");
      return;
    }
    try {
      await authApis().put(endpoints["admin-employer-reject"](rejectId), {
        reason,
      });
      toast.error(`❌ Rejected: ${reason}`);
      await loadEmployers(); // reload lại toàn bộ để đồng bộ
      setOpen(false);
      setReason("");
      setRejectId(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to reject!");
    }
  };

  // 🔹 chia tab theo trạng thái
  const pending = employers.filter((e) => !e.isVerified && !e.reasonReject);
  const approved = employers.filter((e) => e.isVerified);
  const rejected = employers.filter((e) => !e.isVerified && e.reasonReject);

  const renderTable = (list, showActions = false, showReason = false) => (
    <div className="overflow-x-auto border rounded-lg mt-4 shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Company Name</th>
            <th className="p-3 text-left">Tax Code</th>
            <th className="p-3 text-left">Website</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Intro</th>
            {showReason && (
              <th className="p-3 text-left text-red-600">Reason Reject</th>
            )}
            {showActions && <th className="p-3 text-left">Action</th>}
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((emp) => (
              <tr
                key={emp.id}
                className="border-t hover:bg-blue-50 transition-colors"
              >
                <td className="p-3 font-medium">{emp.companyName}</td>
                <td className="p-3">{emp.taxCode}</td>
                <td className="p-3">
                  <a
                    href={emp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {emp.website}
                  </a>
                </td>
                <td className="p-3">{emp.companyAddress}</td>
                <td className="p-3">{emp.companyIntro}</td>
                {showReason && (
                  <td className="p-3 text-red-600 font-medium italic">
                    {emp.reasonReject}
                  </td>
                )}
                {showActions && (
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleVerify(emp.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✅ Verify
                    </button>
                    <button
                      onClick={() => {
                        setRejectId(emp.id);
                        setOpen(true);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌ Reject
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5 + (showReason ? 1 : 0) + (showActions ? 1 : 0)}
                className="text-center p-6 text-gray-500 italic"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📋 Employers Management</h2>

      <Tabs.Root defaultValue="pending">
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4">
          <Tabs.Trigger
            value="pending"
            className="px-4 py-2 data-[state=active]:border-b-2 border-blue-500 font-medium"
          >
            Chờ duyệt{" "}
            <span className="ml-1 text-blue-600">({pending.length})</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="approved"
            className="px-4 py-2 data-[state=active]:border-b-2 border-green-500 font-medium"
          >
            Đã duyệt{" "}
            <span className="ml-1 text-green-600">({approved.length})</span>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="rejected"
            className="px-4 py-2 data-[state=active]:border-b-2 border-red-500 font-medium"
          >
            Bị từ chối{" "}
            <span className="ml-1 text-red-600">({rejected.length})</span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pending">{renderTable(pending, true)}</Tabs.Content>
        <Tabs.Content value="approved">{renderTable(approved)}</Tabs.Content>
        <Tabs.Content value="rejected">
          {renderTable(rejected, false, true)}
        </Tabs.Content>
      </Tabs.Root>

      {/* Dialog reject */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold text-red-600">
              🚫 Từ chối nhà tuyển dụng
            </Dialog.Title>
            <p className="text-gray-600 text-sm">
              Vui lòng nhập lý do từ chối để thông báo cho nhà tuyển dụng.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-400"
              rows={4}
              placeholder="Nhập lý do..."
            />
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  Hủy
                </button>
              </Dialog.Close>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
