import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";

const PROVINCES = [
  "An Giang", "Bắc Ninh", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
  "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Nội",
  "Hà Tĩnh", "Hải Phòng", "Huế", "Hưng Yên", "Khánh Hòa", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ",
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên",
  "Thanh Hóa", "TP.HCM", "Tuyên Quang", "Vĩnh Long"
];

const JOB_TYPES = [
  { value: "PARTTIME", label: "Bán thời gian" },
  { value: "REMOTE", label: "Làm việc từ xa" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Thực tập" },
];

const STATUS_MAP = {
  OPEN: { label: "Đang mở", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  CLOSED: { label: "Đã đóng", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  HIDDEN: { label: "Ẩn", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" }
};

const initialJob = {
  title: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "",
  expiredAt: "",
  status: "OPEN",
};

export default function EmployerDashboard() {
  const [jobPosts, setJobPosts] = useState([]);
  const [form, setForm] = useState(initialJob);
  const [editingJob, setEditingJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

  const loadJobPosts = async () => {
    try {
      let res = await authApis().get(endpoints["jobposts"]);
      setJobPosts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setJobPosts([]);
    }
  };

  useEffect(() => {
    loadJobPosts();
  }, [reload]);

  const resetForm = () => {
    setForm(initialJob);
    setEditingJob(null);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? String(Number(form.salaryMin)) : "",
        salaryMax: form.salaryMax ? String(Number(form.salaryMax)) : "",
      };
      if (editingJob) {
        await authApis().put(endpoints["jobpost-id"](editingJob.id), payload);
      } else {
        await authApis().post(endpoints["jobpost"], payload);
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch { }
  };

  const deleteJobPost = async (id) => {
    try {
      await authApis().delete(endpoints["jobpost-id"](id));
      setReload((prev) => prev + 1);
    } catch { }
  };

  const startEdit = (job) => {
    setForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      jobType: job.jobType || "",
      expiredAt: job.expiredAt ? job.expiredAt.slice(0, 16) : "",
      status: job.status || "OPEN",
    });
    setEditingJob(job);
    setOpen(true);
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      await authApis().put(endpoints["jobpost-id"](job.id), {
        ...job,
        status: newStatus
      });
      setReload(prev => prev + 1);
    } catch { }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-xl shadow p-6 text-[16px] leading-relaxed text-gray-800 dark:text-gray-100">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="flex items-center gap-2 bg-neutral-900 dark:bg-beige dark:text-black text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 dark:hover:bg-[#f5f5dc] mb-4">            <PlusCircledIcon className="w-5 h-5" /> Đăng tuyển dụng mới
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-neutral-800 p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none text-black dark:text-white">
            <Dialog.Title className="text-2xl font-bold mb-2">{editingJob ? "Cập nhật tuyển dụng" : "Đăng tuyển dụng"}</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Tiêu đề" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" />
              <textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" />
              <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white">
                <option value="">Chọn tỉnh/thành phố</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex gap-3">
                <input type="number" min={0} placeholder="Lương tối thiểu (triệu)" value={form.salaryMin} onChange={e => setForm(f => ({ ...f, salaryMin: e.target.value }))} className="w-1/2 rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" step={0.1} />
                <input type="number" min={0} placeholder="Lương tối đa (triệu)" value={form.salaryMax} onChange={e => setForm(f => ({ ...f, salaryMax: e.target.value }))} className="w-1/2 rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" step={0.1} />
              </div>
              <select value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))} required className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white">
                <option value="">Chọn loại công việc</option>
                {JOB_TYPES.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
              </select>
              <input type="datetime-local" value={form.expiredAt} onChange={(e) => setForm(f => ({ ...f, expiredAt: e.target.value }))} className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" />
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white">
                {Object.keys(STATUS_MAP).map(st => <option key={st} value={st}>{STATUS_MAP[st].label}</option>)}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold"> {editingJob ? "Cập nhật" : "Đăng tuyển"} </button>
                {editingJob && <button onClick={resetForm} type="button" className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white py-2 rounded-lg font-semibold">Huỷ</button>}
              </div>
            </form>
            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600"><Cross2Icon /></button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="space-y-5 w-full">
        {jobPosts.length === 0 && (
          <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 dark:bg-neutral-800 border dark:border-neutral-700">
            Chưa có bài tuyển dụng nào.
          </div>
        )}
        {jobPosts.map((job) => (
          <div key={job.id} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-sm px-6 py-5 border dark:border-neutral-700 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{job.title}</h4>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${STATUS_MAP[job.status]?.color}`}>
                    {STATUS_MAP[job.status]?.label || job.status}
                  </span>
                </div>
                <span className="text-sm">{job.location} - {JOB_TYPES.find(j => j.value === job.jobType)?.label || job.jobType}</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Lương: {job.salaryMin} - {job.salaryMax} triệu
                </span>
                <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">{job.description}</div>
                <div className="mt-1 text-xs text-gray-400">
                  Hạn nộp: {job.expiredAt ? new Date(job.expiredAt).toLocaleString() : "Không có"}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => startEdit(job)} className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-200 dark:hover:bg-yellow-600 border dark:border-neutral-600 text-black dark:text-white">
                  <Pencil2Icon />
                </button>
                <button onClick={() => deleteJobPost(job.id)} className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-500 dark:hover:bg-red-600 hover:text-white border dark:border-neutral-600 text-black dark:text-white">
                  <TrashIcon />
                </button>
                <select value={job.status} onChange={e => handleStatusChange(job, e.target.value)} className="text-xs mt-2 rounded border px-2 py-1 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white" style={{ minWidth: 90 }}>
                  {Object.keys(STATUS_MAP).map(st => (
                    <option key={st} value={st}>{STATUS_MAP[st].label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
