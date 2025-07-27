import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";

const initialJob = {
  title: "",
  description: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  jobType: "",
  expiredAt: "",
};

export default function JobPosts() {
  const [jobPosts, setJobPosts] = useState([]);
  const [form, setForm] = useState(initialJob);
  const [editingJob, setEditingJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

  // Load jobposts của employer
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
      if (editingJob) {
        await authApis().put(endpoints["jobpost-id"](editingJob.id), form);
      } else {
        await authApis().post(endpoints["jobpost"], form);
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch {}
  };

  const deleteJobPost = async (id) => {
    try {
      await authApis().delete(endpoints["jobpost-id"](id));
      setReload((prev) => prev + 1);
    } catch {}
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
    });
    setEditingJob(job);
    setOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 mb-4">
            <PlusCircledIcon className="w-5 h-5" /> Đăng tuyển dụng mới
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-xl border border-neutral-200 z-50 focus:outline-none">
            <Dialog.Title className="text-2xl font-bold mb-2">{editingJob ? "Cập nhật tuyển dụng" : "Đăng tuyển dụng"}</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Tiêu đề" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full rounded-lg border px-4 py-2" />
              <textarea placeholder="Mô tả" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required className="w-full rounded-lg border px-4 py-2" />
              <input placeholder="Địa điểm" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} required className="w-full rounded-lg border px-4 py-2" />
              <div className="flex gap-3">
                <input type="number" min={0} placeholder="Lương tối thiểu" value={form.salaryMin} onChange={(e) => setForm(f => ({ ...f, salaryMin: e.target.value }))} className="w-1/2 rounded-lg border px-4 py-2" />
                <input type="number" min={0} placeholder="Lương tối đa" value={form.salaryMax} onChange={(e) => setForm(f => ({ ...f, salaryMax: e.target.value }))} className="w-1/2 rounded-lg border px-4 py-2" />
              </div>
              <input placeholder="Loại hình công việc" value={form.jobType} onChange={(e) => setForm(f => ({ ...f, jobType: e.target.value }))} className="w-full rounded-lg border px-4 py-2" />
              <input type="datetime-local" value={form.expiredAt} onChange={(e) => setForm(f => ({ ...f, expiredAt: e.target.value }))} className="w-full rounded-lg border px-4 py-2" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold">{editingJob ? "Cập nhật" : "Đăng tuyển"}</button>
                {editingJob && <button onClick={resetForm} type="button" className="flex-1 bg-neutral-100 text-neutral-900 py-2 rounded-lg font-semibold">Huỷ</button>}
              </div>
            </form>
            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200"><Cross2Icon /></button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="space-y-5 w-full">
        {jobPosts.length === 0 && (
          <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 border">Chưa có bài tuyển dụng nào.</div>
        )}
        {jobPosts.map((job) => (
          <div key={job.id} className="bg-neutral-50 rounded-xl shadow-sm px-6 py-5 border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold">{job.title}</h4>
                <span className="text-sm">{job.location} - {job.jobType}</span>
                <span className="text-sm text-neutral-500">Lương: {job.salaryMin} - {job.salaryMax} triệu</span>
                <div className="mt-2 text-sm">{job.description}</div>
                <div className="mt-1 text-xs text-gray-400">
                  Hạn nộp: {job.expiredAt ? new Date(job.expiredAt).toLocaleString() : "Không có"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => startEdit(job)} className="p-2 rounded-lg bg-neutral-100 hover:bg-yellow-200 border"><Pencil2Icon /></button>
                <button onClick={() => deleteJobPost(job.id)} className="p-2 rounded-lg bg-neutral-100 hover:bg-red-400 hover:text-white border"><TrashIcon /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}