import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X, Pencil, Trash2, PlusCircle } from "lucide-react";
import locationData from "@assets/vietnam-provinces.json";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl shadow bg-white dark:bg-neutral-900 border dark:border-neutral-700 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, variant = "default", className = "", ...props }) {
  const base = "px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2";
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-beige dark:text-black dark:hover:bg-[#f5f5dc]",
    secondary: "bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-neutral-100 dark:bg-neutral-700 border dark:border-neutral-600 hover:bg-yellow-200 dark:hover:bg-yellow-600 text-black dark:text-white",
    icon: "p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 border dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Dialog({ open, onOpenChange, title, children }) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <RadixDialog.Content
          className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 
             rounded-xl bg-white dark:bg-neutral-800 p-8 shadow-xl 
             border border-neutral-200 dark:border-neutral-700 
             z-50 focus:outline-none text-black dark:text-white 
             overflow-y-auto">

          {title && (
            <RadixDialog.Title className="text-2xl font-bold mb-4">{title}</RadixDialog.Title>
          )}
          {children}
          <RadixDialog.Close asChild>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600">
              <X />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-lg border px-4 py-2 dark:bg-neutral-900 dark:border-neutral-600 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

const JOB_TYPES = [
  { value: "FULLTIME", label: "Toàn thời gian" },
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
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [jobPosts, setJobPosts] = useState([]);
  const [form, setForm] = useState(initialJob);
  const [editingJob, setEditingJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

  // Location selection states
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [availableCommunes, setAvailableCommunes] = useState([]);

  useEffect(() => {
    if (selectedProvince) {
      const communes = locationData.commune.filter(
        (c) => c.idProvince === selectedProvince
      );
      setAvailableCommunes(communes);
      setSelectedCommune("");
    } else {
      setAvailableCommunes([]);
      setSelectedCommune("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    const provinceName =
      locationData.province.find((p) => p.idProvince === selectedProvince)?.name ||
      "";
    const communeName =
      locationData.commune.find((c) => c.idCommune === selectedCommune)?.name ||
      "";

    const addressParts = [];
    if (streetAddress.trim()) addressParts.push(streetAddress.trim());
    if (communeName) addressParts.push(communeName);
    if (provinceName) addressParts.push(provinceName);

    const fullAddress = addressParts.join(", ");
    setForm((prev) => ({ ...prev, location: fullAddress }));
  }, [selectedProvince, selectedCommune, streetAddress]);

  // Update available communes when province changes
  useEffect(() => {
    if (selectedProvince) {
      const communes = locationData.commune.filter(c => c.idProvince === selectedProvince);
      setAvailableCommunes(communes);
      setSelectedCommune(""); // Reset commune selection
    } else {
      setAvailableCommunes([]);
      setSelectedCommune("");
    }
  }, [selectedProvince]);

  // Update form.location when address components change
  useEffect(() => {
    const provinceName = locationData.province.find(p => p.idProvince === selectedProvince)?.name || "";
    const communeName = locationData.commune.find(c => c.idCommune === selectedCommune)?.name || "";

    const addressParts = [];
    if (streetAddress.trim()) addressParts.push(streetAddress.trim());
    if (communeName) addressParts.push(communeName);
    if (provinceName) addressParts.push(provinceName);

    const fullAddress = addressParts.join(", ");
    setForm(prev => ({ ...prev, location: fullAddress }));
  }, [selectedProvince, selectedCommune, streetAddress]);

  // Parse existing location when editing
  const parseExistingLocation = (location) => {
    if (!location) {
      setSelectedProvince("");
      setSelectedCommune("");
      setStreetAddress("");
      return;
    }

    // Try to extract province and commune from the location string
    const provinces = locationData.province;
    const communes = locationData.commune;

    let foundProvince = null;
    let foundCommune = null;
    let remainingAddress = location;

    // Find province in the location string
    for (const province of provinces) {
      if (location.includes(province.name)) {
        foundProvince = province;
        remainingAddress = remainingAddress.replace(province.name, "").trim();
        break;
      }
    }

    // Find commune in the location string
    if (foundProvince) {
      const provinceCommunnes = communes.filter(c => c.idProvince === foundProvince.idProvince);
      for (const commune of provinceCommunnes) {
        if (location.includes(commune.name)) {
          foundCommune = commune;
          remainingAddress = remainingAddress.replace(commune.name, "").trim();
          break;
        }
      }
    }

    setSelectedProvince(foundProvince ? foundProvince.idProvince : "");
    setSelectedCommune(foundCommune ? foundCommune.idCommune : "");

    // Remove trailing commas and spaces
    remainingAddress = remainingAddress.replace(/^,\s*|,\s*$/g, "");
    setStreetAddress(remainingAddress);
  };

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await authApis().get(endpoints["employer-profile"]);
        setProfile(res.data);
      } catch (err) {
        console.error("Không thể load employer profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  // Load job posts
  const loadJobPosts = async () => {
    try {
      const res = await authApis().get(endpoints["employer-jobposts"]);
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
    setSelectedProvince("");
    setSelectedCommune("");
    setStreetAddress("");
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
        await authApis().put(endpoints["employer-jobpost-id"](editingJob.id), payload);
      } else {
        await authApis().post(endpoints["employer-jobpost"], payload);
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJobPost = async (id) => {
    try {
      await authApis().delete(endpoints["employer-jobpost-id"](id));
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
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
    parseExistingLocation(job.location);
    setOpen(true);
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      await authApis().put(endpoints["employer-jobpost-id"](job.id), { ...job, status: newStatus });
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full p-6 text-[16px] leading-relaxed">
      {/* Nút Đăng tuyển */}
      <RadixDialog.Root open={open} onOpenChange={setOpen}>
        <RadixDialog.Trigger asChild>
          <Button
            variant={profile?.isVerified ? "default" : "secondary"}
            disabled={!profile?.isVerified}
            className="mb-4 shadow"
            title={!profile?.isVerified ? "Cần xác minh tài khoản mới được đăng tuyển" : ""}
          >
            <PlusCircle className="w-5 h-5" /> Đăng tuyển dụng mới
          </Button>
        </RadixDialog.Trigger>

        {profile?.isVerified && (
          <Dialog open={open} onOpenChange={setOpen} title={editingJob ? "Cập nhật tuyển dụng" : "Đăng tuyển dụng"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Tiêu đề"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />

              <Textarea
                placeholder="Mô tả"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />

              {/* Location selection section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Địa chỉ làm việc
                </label>

                <Select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {locationData.province.map((province) => (
                    <option key={province.idProvince} value={province.idProvince}>
                      {province.name}
                    </option>
                  ))}
                </Select>

                <Select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  disabled={!selectedProvince}
                  required
                >
                  <option value="">Chọn Phường/Xã</option>
                  {availableCommunes.map((commune) => (
                    <option key={commune.idCommune} value={commune.idCommune}>
                      {commune.name}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Số nhà, tên đường (vd: 72 Lê Thánh Tôn)"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                />

                {form.location && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <strong>Địa chỉ đầy đủ:</strong> {form.location}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Input
                  type="number"
                  min={0}
                  placeholder="Lương tối thiểu (triệu)"
                  value={form.salaryMin}
                  onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
                  step={0.1}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Lương tối đa (triệu)"
                  value={form.salaryMax}
                  onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
                  step={0.1}
                  className="w-1/2"
                />
              </div>

              <Select
                value={form.jobType}
                onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))}
                required
              >
                <option value="">Chọn loại công việc</option>
                {JOB_TYPES.map((j) => (
                  <option key={j.value} value={j.value}>
                    {j.label}
                  </option>
                ))}
              </Select>

              <Input
                type="datetime-local"
                value={form.expiredAt}
                onChange={(e) => setForm((f) => ({ ...f, expiredAt: e.target.value }))}
              />

              <Select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {Object.keys(STATUS_MAP).map((st) => (
                  <option key={st} value={st}>
                    {STATUS_MAP[st].label}
                  </option>
                ))}
              </Select>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingJob ? "Cập nhật" : "Đăng tuyển"}
                </Button>
                {editingJob && (
                  <Button type="button" variant="secondary" onClick={resetForm} className="flex-1">
                    Huỷ
                  </Button>
                )}
              </div>
            </form>
          </Dialog>
        )}
      </RadixDialog.Root>

      {/* Thông báo xác minh */}
      {!loadingProfile && profile && !profile.isVerified && (
        <div className="text-sm text-red-500 mb-4">
          Tài khoản của bạn chưa được xác minh. Vui lòng đợi xác minh trước khi đăng tuyển.
        </div>
      )}

      {/* Danh sách job posts */}
      <div className="space-y-5 w-full">
        {jobPosts.length === 0 && (
          <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 dark:bg-neutral-800 border dark:border-neutral-700">
            Chưa có bài tuyển dụng nào.
          </div>
        )}
        {jobPosts.map((job) => (
          <Card key={job.id} className="px-6 py-5 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{job.title}</h4>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${STATUS_MAP[job.status]?.color}`}>
                    {STATUS_MAP[job.status]?.label || job.status}
                  </span>
                </div>
                <span className="text-sm">
                  {job.location} - {JOB_TYPES.find((j) => j.value === job.jobType)?.label || job.jobType}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Lương: {job.salaryMin} - {job.salaryMax} triệu
                </span>
                <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">{job.description}</div>
                <div className="mt-1 text-xs text-gray-400">
                  Hạn nộp: {job.expiredAt ? new Date(job.expiredAt).toLocaleString() : "Không có"}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Button variant="ghost" onClick={() => startEdit(job)}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" onClick={() => deleteJobPost(job.id)} className="hover:bg-red-500 hover:text-white">
                  <Trash2 size={16} />
                </Button>
                <Select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job, e.target.value)}
                  className="text-xs mt-2"
                  style={{ minWidth: 90 }}
                >
                  {Object.keys(STATUS_MAP).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_MAP[st].label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}