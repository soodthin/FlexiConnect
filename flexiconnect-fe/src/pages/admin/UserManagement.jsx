import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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
        headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadUsers();
      toast.success(`Cập nhật trạng thái: ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể cập nhật trạng thái!");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      const token = localStorage.getItem("token");
      await authApis().delete(
        `${endpoints["admin-users-management"]}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadUsers();
      toast.success("Xóa user thành công!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể xóa user!");
    }
  };

  const renderTable = (list) => (
    <div className="overflow-x-auto border rounded-lg mt-4 shadow-sm dark:border-neutral-700">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200">
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
                <span className={`px-3 py-1 rounded-full font-medium ${
                  u.status === "ACTIVE" ? "bg-green-500 text-white" :
                  u.status === "BANNED" ? "bg-red-500 text-white" :
                  "bg-gray-400 text-white"
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
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-full shadow hover:scale-105 transform transition"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-500 dark:text-gray-400 italic">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-beige-light dark:bg-[#181818] text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>

      {/* Tabs */}
      <Tabs.Root defaultValue={roleFilter} onValueChange={setRoleFilter}>
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4 dark:border-neutral-700">
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
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-[#2d2d2d] dark:text-gray-100 dark:border-neutral-600"
        />
        <select
          value={size}
          onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-[#2d2d2d] dark:text-gray-100 dark:border-neutral-600"
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
          className="px-4 py-2 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-[#333] disabled:opacity-50 transition"
        >
          ◀ Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-[#333] disabled:opacity-50 transition"
        >
          Trang sau ▶
        </button>
      </div>
    </div>
  );
}

export default UserManagement;
