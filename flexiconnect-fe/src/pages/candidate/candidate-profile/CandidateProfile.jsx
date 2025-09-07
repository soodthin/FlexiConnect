import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import EducationHistory from "@candidateProfile/EducationHistory";
import Skill from "@candidateProfile/Skill";
import WorkExperience from "@candidateProfile/WorkExperience";
import classNames from "classnames";
import { toast } from "sonner";
import {
  Pencil,
  Wand2,
  X,
  Camera,
  Crown,
  Zap,
} from "lucide-react";

const Button = ({ className, children, ...props }) => (
  <button
    className={classNames(
      "px-4 py-2 rounded-lg font-medium transition disabled:opacity-60",
      className
    )}
    {...props}
  >
    {children}
  </button>
);


const Section = ({ id, innerRef, children }) => (
  <section
    id={id}
    ref={innerRef}
    className="bg-white dark:bg-[#232323] rounded-xl shadow p-6"
  >
    {children}
  </section>
);


const Dialog = ({ open, onClose, title, children }) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#2d2d2d] rounded-xl shadow-xl p-6 max-w-lg w-full z-10">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#444]"
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  ) : null;


const UpgradeDialog = ({ open, onClose, onUpgrade }) => (
  <Dialog open={open} onClose={onClose} title="">
    <div className="text-center">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Nâng cấp tài khoản AI
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Bạn cần nâng cấp tài khoản để sử dụng tính năng AI
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        {/* Basic Package */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-blue-800 dark:text-blue-300">Basic</h4>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">55.000₫</span>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 text-left space-y-1">
            <li>• Đánh giá CV tự động bằng AI</li>
            <li>• Gợi ý chỉnh sửa CV</li>
          </ul>
        </div>

        {/* Premium Package */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-purple-800 dark:text-purple-300">Premium</h4>
              <span className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-semibold">
                Phổ biến
              </span>
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">115.000₫</span>
          </div>
          <ul className="text-sm text-purple-700 dark:text-purple-300 text-left space-y-1">
            <li>• Tất cả tính năng Basic</li>
            <li>• Mock interview với AI</li>
            <li>• Tạo Cover Letter bằng AI</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onClose}
          className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white hover:bg-gray-300"
        >
          Để sau
        </Button>
        <Button
          onClick={onUpgrade}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          Nâng cấp ngay
        </Button>
      </div>
    </div>
  </Dialog>
);

// ----------------- Feature Component -----------------
const SECTIONS = [
  { id: "profile", label: "Thông tin cá nhân" },
  { id: "education", label: "Học vấn" },
  { id: "experience", label: "Kinh nghiệm" },
  { id: "skills", label: "Kỹ năng - Lưu Job" },
];

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return "Hiện tại";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [scrollTarget, setScrollTarget] = useState("");
  const [currentSection, setCurrentSection] = useState("profile");
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    title: "",
    bio: "",
    gender: "",
  });

  const [bioSuggestion, setBioSuggestion] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const sectionRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["candidate-profile"]);
      setProfile(res.data);

      // Kiểm tra AI access
      const pkg = res.data.userPackage;
      setIsVerified(pkg?.isActive === true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (scrollTarget) {
      sectionRefs.current[scrollTarget]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setScrollTarget("");
    }
  }, [scrollTarget]);

  useEffect(() => {
    const onScroll = () => {
      const offs = SECTIONS.map(({ id }) => {
        const el = sectionRefs.current[id];
        return {
          id,
          top: el ? Math.abs(el.getBoundingClientRect().top - 120) : Infinity,
        };
      });
      offs.sort((a, b) => a.top - b.top);
      setCurrentSection(offs[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const checkAIAccess = () => isVerified;

  const handleAIFeatureClick = (callback) => {
    if (checkAIAccess()) {
      callback();
    } else {
      setIsUpgradeDialogOpen(true);
    }
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await authApis().post(endpoints["candidate-avatar"], fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarTimestamp(Date.now());
      toast.success(" Ảnh đại diện đã được cập nhật!");
    } catch {
      toast.error(" Lỗi khi cập nhật ảnh đại diện.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authApis().put(endpoints["candidate-profile"], {
        ...form,
        bio: bioSuggestion || form.bio,
        avatar: profile.avatar,
      });
      toast.success(" Đã cập nhật!");
      loadProfile();
      setIsDialogOpen(false);
    } catch {
      toast.error(" Cập nhật thất bại!");
    }
  };

  const handleOpenEdit = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      title: profile.title || "",
      bio: profile.bio || "",
      gender: profile.gender || "",
    });
    setBioSuggestion("");
    setIsDialogOpen(true);
  };

  const handleGetSuggestion = async () => {
    if (!form.bio) {
      toast.info(" Vui lòng nhập vài ý chính để AI gợi ý.");
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await authApis().post(endpoints["cv-suggestion"], {
        originalInput: form.bio,
      });
      if (res.data?.aiSuggestion) {
        setBioSuggestion(res.data.aiSuggestion);
        toast.success(" AI đã tạo gợi ý!");
      }
    } catch {
      toast.error(" AI gợi ý thất bại.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleUpgradeRedirect = () => {
    setIsUpgradeDialogOpen(false);

    navigate("/candidate-upgrade");
  };

  return (
    <div className="w-full min-h-screen flex bg-beige-light dark:bg-[#181818]">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col gap-2 w-56 h-screen sticky top-0 p-4 bg-white dark:bg-[#232323] border-r dark:border-neutral-700">
        <Button
          onClick={() => navigate("/candidate-dashboard")}
          className="bg-black text-beige dark:bg-beige dark:text-black text-xs shadow"
        >
          ← Quay về
        </Button>
        {SECTIONS.map((sec) => (
          <Button
            key={sec.id}
            onClick={() => setScrollTarget(sec.id)}
            className={classNames(
              "flex items-center gap-2 text-sm justify-start",
              currentSection === sec.id
                ? "bg-black dark:bg-beige text-beige dark:text-black shadow"
                : "bg-gray-100 dark:bg-[#353535] text-gray-600 dark:text-beige hover:bg-beige-light"
            )}
          >
            <span>{sec.icon}</span> {sec.label}
            {sec.id === "skills"}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-8 text-gray-800 dark:text-gray-100">


        {/* Hiển thị gói hiện tại */}
        {profile?.userPackage && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Gói hiện tại:</span>

            <div
              className={classNames(
                "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm",
                profile.userPackage.isActive
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200"
                  : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200"
              )}
            >
              {profile.userPackage.name}
              {profile.userPackage.isActive && profile.userPackage.endDate && (
                <span className="text-xs bg-white/30 dark:bg-gray-700/50 px-2 py-0.5 rounded">
                  Hết hạn {formatDate(profile.userPackage.endDate)}
                </span>
              )}
              {!profile.userPackage.isActive && <span>⛔ Hết hạn</span>}
            </div>
          </div>
        )}

        {profile ? (
          <div className="flex flex-col gap-8">
            {/* Profile Section */}
            <Section
              id="profile"
              innerRef={(el) => (sectionRefs.current["profile"] = el)}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="relative w-24 h-24 shrink-0">
                  <img
                    src={
                      profile.avatar
                        ? `${profile.avatar}?t=${avatarTimestamp}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          profile.fullName || "Candidate"
                        )}`
                    }
                    alt="Avatar"
                    className="rounded-full w-20 h-20 object-cover border-2 shadow"
                  />
                  <label className="absolute bottom-0 right-0 bg-white dark:bg-[#333] rounded-full p-1 cursor-pointer text-xs shadow">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold dark:text-beige">
                      {profile.fullName}
                      {checkAIAccess() && (
                        <Crown size={16} className="inline ml-2 text-yellow-500" />
                      )}
                    </h2>
                    <Button
                      onClick={handleOpenEdit}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Pencil size={14} /> Chỉnh sửa
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {profile.email}
                    </div>
                    <div>
                      <span className="font-semibold">SĐT:</span>{" "}
                      {profile.phoneNumber}
                    </div>
                    <div>
                      <span className="font-semibold">Địa chỉ: </span>{" "}
                      {profile.address}
                    </div>
                    <div>
                      <span className="font-semibold">Tiêu đề:</span>{" "}
                      {profile.title}
                    </div>
                    <div>
                      <span className="font-semibold">Giới tính:</span>{" "}
                      {profile.gender === "MALE"
                        ? "Nam"
                        : profile.gender === "FEMALE"
                          ? "Nữ"
                          : profile.gender === "OTHER"
                            ? "Khác"
                            : "-"}
                    </div>

                  </div>

                  {profile.bio && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Giới thiệu:</span>{" "}
                      {profile.bio}
                    </div>
                  )}

                  {profile.resumeFile && (
                    <a
                      href={profile.resumeFile}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-3 px-4 py-2 bg-beige dark:bg-[#282828] text-[#111] dark:text-beige rounded-full text-xs font-semibold shadow hover:underline"
                    >
                      📄 Xem CV hiện tại
                    </a>
                  )}
                </div>
              </div>
            </Section>

            {/* Other Sections */}
            <Section
              id="education"
              innerRef={(el) => (sectionRefs.current["education"] = el)}
            >
              <EducationHistory />
            </Section>
            <Section id="experience" innerRef={(el) => (sectionRefs.current["experience"] = el)}>
              <WorkExperience
                userPackage={profile.userPackage}
                onUpgradeClick={() => setIsUpgradeDialogOpen(true)}
              />
            </Section>

            <Section
              id="skills"
              innerRef={(el) => (sectionRefs.current["skills"] = el)}
            >
              <Skill onUpgradeClick={() => setIsUpgradeDialogOpen(true)} />
            </Section>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300 py-16">
            Đang tải thông tin hồ sơ...
          </div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Cập nhật thông tin"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {["fullName", "phoneNumber", "address", "title"].map((f) => {
            const labels = {
              fullName: "Họ và tên",
              phoneNumber: "Số điện thoại",
              address: "Địa chỉ",
              title: "Chức danh"
            };

            return (
              <div key={f}>
                <label className="block text-sm font-medium">
                  {labels[f]}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              </div>
            );
          })}
          <div>
            <label className="block text-sm font-medium">Giới tính</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>


          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Giới thiệu bản thân
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
              placeholder="Nhập vài ý chính..."
            />
            <Button
              type="button"
              onClick={() => handleAIFeatureClick(handleGetSuggestion)}
              disabled={isSuggesting}
              className={classNames(
                "w-full flex items-center justify-center gap-2 text-sm font-semibold",
                checkAIAccess()
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
            >
              {isSuggesting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : checkAIAccess() ? (
                <Wand2 size={16} />
              ) : (
                <Crown size={16} />
              )}
              {isSuggesting
                ? "Đang xử lý..."
                : checkAIAccess()
                  ? " Gợi ý từ AI"
                  : "🔒 Nâng cấp để dùng AI"}
            </Button>

            {bioSuggestion && (
              <div className="mt-3 bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-blue-900/20 rounded-xl p-4 border border-blue-300 dark:border-blue-700 shadow-inner">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Wand2 size={14} /> 🤖 Gợi ý từ AI
                </p>
                <p className="text-sm italic whitespace-pre-wrap">
                  {bioSuggestion}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, bio: bioSuggestion });
                      setBioSuggestion("");
                    }}
                    className="flex-1 bg-blue-600 text-white"
                  >
                    Dùng gợi ý
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setBioSuggestion("")}
                    className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white"
                  >
                    Bỏ qua
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </Button>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white"
            >
              Huỷ
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={isUpgradeDialogOpen}
        onClose={() => setIsUpgradeDialogOpen(false)}
        onUpgrade={handleUpgradeRedirect}
      />
    </div>
  );
}
