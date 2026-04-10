import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-full shadow font-semibold transition border
        bg-beige-200 dark:bg-dark-bg-secondary text-softblack dark:text-beige-200
        border-neutral-300 dark:border-dark-border-primary
        hover:bg-beige-300 dark:hover:bg-dark-bg-elevated ${className}`}
    >
      {children}
    </button>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark"
    );
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await authApis().get(endpoints["admin-users-management"], {
        params: { role: roleFilter === "ALL" ? "" : roleFilter, search, page, size },
      });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Lỗi load danh sách!");
    }
  };

  useEffect(() => { loadUsers(); }, [roleFilter, search, page, size]);

  const updateStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      await authApis().put(
        `${endpoints["admin-users-management"]}/${userId}/status`,
        { status },
      );
      loadUsers();
      toast.success(`Cập nhật trạng thái: ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể cập nhật trạng thái!");
    }
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await authApis().delete(
        `${endpoints["admin-users-management"]}/${selectedUserId}`
      );
      loadUsers();
      toast.success("Xóa user thành công!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể xóa user!");
    } finally {
      setShowDeleteConfirm(false);
      setSelectedUserId(null);
    }
  };

  const renderTable = (list) => (
    <div className="overflow-x-auto border rounded-lg mt-4 shadow-sm dark:border-dark-border-primary">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-neutral-100 dark:bg-dark-bg-tertiary text-neutral-700 dark:text-neutral-200">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Họ tên</th>
            <th className="p-3 text-left">Roles</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? list.map(u => (
            <tr key={u.id} className="border-t hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
              <td className="p-3 font-medium">{u.id}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.fullName}</td>
              <td className="p-3">{u.roles?.join(", ")}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full font-medium ${u.status === "ACTIVE" ? "bg-green-500 text-white" :
                  u.status === "BANNED" ? "bg-red-500 text-white" :
                    "bg-neutral-400 text-white"
                  }`}>
                  {u.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => updateStatus(u.id, "ACTIVE")}
                  disabled={u.status === "ACTIVE"}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow hover:scale-105 transform transition disabled:opacity-50"
                >
                  Kích hoạt
                </button>
                <button
                  onClick={() => updateStatus(u.id, "BANNED")}
                  disabled={u.status === "BANNED"}
                  className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow hover:scale-105 transform transition disabled:opacity-50"
                >
                  Khóa
                </button>

                <button
                  onClick={() => handleDeleteClick(u.id)}
                  className="px-3 py-1 bg-neutral-500 text-white rounded-full shadow hover:scale-105 transform transition"
                >
                  Xóa
                </button>

                {showDeleteConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                      className="absolute inset-0 bg-black/50"
                      onClick={() => setShowDeleteConfirm(false)}
                    ></div>
                    <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg p-6 w-80 relative z-10 text-center">
                      <h3 className="text-lg font-semibold mb-4 dark:text-beige-200">
                        Xác nhận xóa user
                      </h3>
                      <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                        Bạn có chắc chắn muốn xóa user này không?
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button onClick={() => setShowDeleteConfirm(false)}>Hủy</Button>
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                          onClick={confirmDelete}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </td>
            </tr>

          )) : (
            <tr>
              <td colSpan={6} className="text-center p-6 text-neutral-500 dark:text-neutral-400 italic">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-beige-light dark:bg-dark-bg-primary text-neutral-800 dark:text-neutral-100">
      <h2 className="text-2xl font-bold mb-6">TRANG QUẢN LÝ NGƯỜI DÙNG</h2>

      {/* Tabs */}
      <Tabs.Root defaultValue={roleFilter} onValueChange={setRoleFilter}>
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4 dark:border-dark-border-primary">
          <Tabs.Trigger value="ALL" className="px-4 py-2 data-[state=active]:border-b-2 border-blue-500 font-medium">
            Tất cả
          </Tabs.Trigger>
          <Tabs.Trigger value="CANDIDATE" className="px-4 py-2 data-[state=active]:border-b-2 border-green-500 font-medium">
            Ứng viên
          </Tabs.Trigger>
          <Tabs.Trigger value="EMPLOYER" className="px-4 py-2 data-[state=active]:border-b-2 border-orange-500 font-medium">
            Nhà tuyển dụng
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* Search + size */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="🔍 Tìm kiếm..."
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-dark-bg-elevated dark:text-neutral-100 dark:border-dark-border-subtle"
        />
        <select
          value={size}
          onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-dark-bg-elevated dark:text-neutral-100 dark:border-dark-border-subtle"
        >
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>

      {renderTable(users)}

      {/* Pagination */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 border rounded-lg shadow hover:bg-neutral-100 dark:hover:bg-[#333] disabled:opacity-50 transition"
        >
          ◀ Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 border rounded-lg shadow hover:bg-neutral-100 dark:hover:bg-[#333] disabled:opacity-50 transition"
        >
          Trang sau ▶
        </button>
      </div>
    </div>
  );
}

export default UserManagement;
