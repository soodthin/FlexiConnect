import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import dayjs from "dayjs";

function JobPostManagement() {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("OPEN");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark"
    );
  }, []);

  const loadJobPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await authApis().get(endpoints["admin-jobposts"], {
        params: {
          status: activeTab,
          search,
          page,
          size,
        },
      });

      setJobPosts(Array.isArray(res.data.content) ? res.data.content : []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Lỗi load danh sách!");
    }
  };

  useEffect(() => {
    loadJobPosts();
  }, [search, page, size, activeTab]);

  const updateStatus = async (id, status) => {
    try {
      await authApis().put(`${endpoints["admin-jobposts"]}/${id}/status`, { status });
      toast.success(`✅ Cập nhật trạng thái: ${status}`);
      loadJobPosts();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Không thể cập nhật trạng thái!");
    }
  };

  const openDetail = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const renderTable = (list, showActions = false) => (
    <div className="overflow-x-auto border rounded-lg mt-4 shadow-sm dark:border-neutral-700">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-[#2b2b2b] text-gray-700 dark:text-gray-200">
          <tr>
            <th className="p-3 text-left">Tiêu đề</th>
            <th className="p-3 text-left">Địa điểm</th>
            <th className="p-3 text-left">Công ty</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Ngày tạo</th>
            {showActions && <th className="p-3 text-left">Chức năng</th>}
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? list.map(job => (
            <tr key={job.id} className="border-t hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
              <td className="p-3 font-medium">{job.title}</td>
              <td className="p-3">{job.location}</td>
              <td className="p-3">{job.companyName}</td>
              <td className="p-3 font-medium">
                <span className={`px-3 py-1 rounded-full text-white font-medium text-xs ${
                  job.status === "OPEN" ? "bg-green-600" :
                  job.status === "CLOSED" ? "bg-red-600" :
                  "bg-orange-500"
                }`}>{job.status}</span>
              </td>
              <td className="p-3">{dayjs(job.createdAt).format("YYYY-MM-DD HH:mm")}</td>
              {showActions && (
                <td className="p-3">
                  <button
                    onClick={() => openDetail(job)}
                    className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:scale-105 transform transition"
                  >
                    Chi tiết
                  </button>
                </td>
              )}
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
      <h2 className="text-2xl font-bold mb-6">📋 Job Post Management</h2>

      {/* Search + size */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="🔍 Tìm kiếm..."
          className="p-2 border rounded dark:bg-[#2d2d2d] dark:text-gray-100 dark:border-neutral-600"
        />
        <select
          value={size}
          onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
          className="p-2 border rounded dark:bg-[#2d2d2d] dark:text-gray-100 dark:border-neutral-600"
        >
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs.Root
        defaultValue="OPEN"
        onValueChange={(v) => { setActiveTab(v); setPage(0); }}
      >
        <Tabs.List className="flex space-x-4 border-b pb-2 mb-4 dark:border-neutral-700">
          <Tabs.Trigger value="OPEN" className="px-4 py-2 data-[state=active]:border-b-2 border-green-500 font-medium">
            Mở
          </Tabs.Trigger>
          <Tabs.Trigger value="CLOSED" className="px-4 py-2 data-[state=active]:border-b-2 border-red-500 font-medium">
            Đóng
          </Tabs.Trigger>
          <Tabs.Trigger value="HIDDEN" className="px-4 py-2 data-[state=active]:border-b-2 border-orange-500 font-medium">
            Ẩn
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="OPEN">{renderTable(jobPosts, true)}</Tabs.Content>
        <Tabs.Content value="CLOSED">{renderTable(jobPosts, true)}</Tabs.Content>
        <Tabs.Content value="HIDDEN">{renderTable(jobPosts, true)}</Tabs.Content>
      </Tabs.Root>

      {/* Pagination */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ◀ Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trang sau ▶
        </button>
      </div>

      {/* Dialog chi tiết */}
      <Dialog.Root open={openModal} onOpenChange={setOpenModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[520px] max-w-full -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#232323] rounded-2xl shadow-2xl p-6 space-y-4">
            {selectedJob && (
              <>
                <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedJob.description}</p>
                <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{selectedJob.companyName}</span>
                  <span>{dayjs(selectedJob.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => updateStatus(selectedJob.id, "OPEN")}
                    disabled={selectedJob.status === "OPEN"}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md disabled:opacity-50 transition"
                  >
                    ✅ Mở
                  </button>
                  <button
                    onClick={() => updateStatus(selectedJob.id, "CLOSED")}
                    disabled={selectedJob.status === "CLOSED"}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md disabled:opacity-50 transition"
                  >
                    🔒 Đóng
                  </button>
                  <button
                    onClick={() => updateStatus(selectedJob.id, "HIDDEN")}
                    disabled={selectedJob.status === "HIDDEN"}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md disabled:opacity-50 transition"
                  >
                    👁️‍🗨️ Ẩn
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

export default JobPostManagement;
