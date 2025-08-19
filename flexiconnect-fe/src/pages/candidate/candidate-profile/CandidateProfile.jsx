import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import EducationHistory from "@candidateProfile/EducationHistory";
import Skill from "@candidateProfile/Skill";
import WorkExperience from "@candidateProfile/WorkExperience";
import classNames from "classnames";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, MagicWandIcon } from "@radix-ui/react-icons";

const SECTIONS = [
  { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
  { id: "education", label: "Học vấn", icon: "🎓" },
  { id: "experience", label: "Kinh nghiệm", icon: "💼" },
  { id: "skills", label: "Kỹ năng ‑ AI", icon: "🛠️" },
];

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [scrollTarget, setScrollTarget] = useState("");
  const [currentSection, setCurrentSection] = useState("profile");
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    title: "",
    bio: "",
  });

  // 📌 AI Suggestion states
  const [bioSuggestion, setBioSuggestion] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const sectionRefs = useRef({});
  const navigate = useNavigate();
  const profileCompletion = 78;

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["candidate-profile"]);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  useEffect(() => {
    if (scrollTarget) {
      const el = sectionRefs.current[scrollTarget];
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã copy link hồ sơ!");
  };
  const handlePreview = () => window.open("/preview-profile", "_blank");
  const handleDownloadPDF = () => alert("Chức năng tải PDF sẽ được cập nhật!");

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
      toast.success("✅ Ảnh đại diện đã được cập nhật!");
    } catch {
      toast.error("❌ Lỗi khi cập nhật ảnh đại diện.");
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
      toast.success("✅ Đã cập nhật!");
      loadProfile();
    } catch {
      toast.error("❌ Cập nhật thất bại!");
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
    });
    setBioSuggestion("");
  };

  const handleGetSuggestion = async () => {
    if (!form.bio) {
      toast.info("Vui lòng nhập vài ý chính để AI gợi ý.");
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await authApis().post(endpoints["cv-suggestion"], {
        originalInput: form.bio,
      });
      if (res.data?.aiSuggestion) {
        setBioSuggestion(res.data.aiSuggestion);
        toast.success("✅ AI đã tạo gợi ý thành công!");
      }
    } catch {
      toast.error("❌ AI gợi ý thất bại.");
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    // ✨ SỬA LẠI: Đổi `h-screen overflow-hidden` thành `min-h-screen` để cho phép cả trang được cuộn
    <div className="w-full min-h-screen flex bg-beige-light dark:bg-[#181818]">
      
        {/* Sidebar */}
        {/* Giữ nguyên `sticky top-0 h-screen` để sidebar luôn dính ở trên cùng */}
        <aside className="hidden sm:flex flex-col gap-2 w-56 h-screen sticky top-0 p-4 bg-white dark:bg-[#232323] border-r dark:border-neutral-700">
            <button
                onClick={() => navigate("/candidate-dashboard")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-beige dark:bg-beige dark:text-black font-semibold shadow hover:bg-gray-800 dark:hover:bg-[#f5f5dc] text-xs"
            >
                ← Quay về
            </button>
            {SECTIONS.map((sec) => (
                <button
                    key={sec.id}
                    onClick={() => setScrollTarget(sec.id)}
                    className={classNames(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition",
                        currentSection === sec.id
                            ? "bg-black dark:bg-beige text-beige dark:text-black shadow"
                            : "bg-gray-100 dark:bg-[#353535] text-gray-600 dark:text-beige hover:bg-beige-light dark:hover:text-white"
                    )}
                >
                    <span>{sec.icon}</span> {sec.label}
                </button>
            ))}
        </aside>

        {/* Main Content */}
        {/* ✨ SỬA LẠI: Xóa `overflow-y-auto` để nội dung chính không tự tạo thanh cuộn riêng nữa */}
        <main className="flex-1 px-4 sm:px-8 py-8 text-gray-800 dark:text-gray-100">
            {/* Header CTA */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-300">Hoàn thiện hồ sơ</span>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-[#282828] rounded-full overflow-hidden">
                        <div className="h-2 bg-blue-500 rounded-full transition-all" style={{ width: `${profileCompletion}%` }}></div>
                    </div>
                    <span className="text-xs text-blue-600 font-bold ml-1">{profileCompletion}%</span>
                </div>
                <button onClick={handleShare} className="button-util">🔗 Chia sẻ</button>
                <button onClick={handlePreview} className="button-util">👁️ Xem trước</button>
                <button onClick={handleDownloadPDF} className="button-util">📄 Tải PDF</button>
                <div className="button-score">⭐ AI Score: 8.9/10</div>
            </div>

            {profile ? (
                <div className="flex flex-col gap-8">
                    <section
                        id="profile"
                        ref={(el) => (sectionRefs.current["profile"] = el)}
                        className="bg-white dark:bg-[#232323] rounded-xl shadow p-6 flex flex-col sm:flex-row items-start gap-6"
                    >
                        {/* Avatar */}
                        <div className="relative w-24 h-24 shrink-0">
                            <img
                                src={
                                    profile.avatar
                                        ? `${profile.avatar}?t=${avatarTimestamp}`
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || "Candidate")}`
                                }
                                alt="Avatar"
                                className="rounded-full w-20 h-20 object-cover border-2 shadow"
                            />
                            <label className="absolute bottom-0 right-0 bg-white dark:bg-[#333] rounded-full p-1 cursor-pointer text-xs shadow">
                                📷
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>

                        {/* Profile Info & Edit */}
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold dark:text-beige">{profile.fullName}</h2>
                                <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                        <button onClick={handleOpenEdit} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            <Pencil2Icon className="w-3 h-3" />
                                            Chỉnh sửa
                                        </button>
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                                        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#2d2d2d] p-8 shadow-xl z-50 max-h-[90vh] overflow-y-auto">
                                            <Dialog.Title className="text-2xl font-bold mb-4">Cập nhật thông tin</Dialog.Title>
                                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                                {/* Họ tên */}
                                                <div>
                                                    <label className="block text-sm font-medium">Họ tên</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                                                        placeholder="Họ tên"
                                                        value={form.fullName}
                                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                                    />
                                                </div>

                                                {/* Số điện thoại */}
                                                <div>
                                                    <label className="block text-sm font-medium">Số điện thoại</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                                                        placeholder="Số điện thoại"
                                                        value={form.phoneNumber}
                                                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                                    />
                                                </div>

                                                {/* Địa chỉ */}
                                                <div>
                                                    <label className="block text-sm font-medium">Địa chỉ</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                                                        placeholder="Địa chỉ"
                                                        value={form.address}
                                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                    />
                                                </div>

                                                {/* Tiêu đề */}
                                                <div>
                                                    <label className="block text-sm font-medium">Tiêu đề</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                                                        placeholder="Tiêu đề"
                                                        value={form.title}
                                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                    />
                                                </div>
                                                
                                                {/* Bio + AI Suggestion Section */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium">Giới thiệu bản thân</label>
                                                    <textarea
                                                        rows={4}
                                                        value={form.bio}
                                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                                        className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]"
                                                        placeholder="Nhập vài ý chính..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleGetSuggestion}
                                                        disabled={isSuggesting}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
                                                    >
                                                        {isSuggesting ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <MagicWandIcon />
                                                        )}
                                                        {isSuggesting ? "Đang xử lý..." : "✨ Gợi ý từ AI"}
                                                    </button>

                                                    {bioSuggestion && (
                                                        <div className="mt-3 bg-gradient-to-br from-blue-50 via-blue-100 to-white dark:from-blue-900/20 rounded-xl p-4 border border-blue-300 dark:border-blue-700 shadow-inner">
                                                            <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2 flex items-center gap-2">
                                                                <MagicWandIcon /> 🤖 Gợi ý từ AI
                                                            </p>
                                                            <p className="text-sm italic text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                                                                {bioSuggestion}
                                                            </p>
                                                            <div className="mt-2 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm({ ...form, bio: bioSuggestion });
                                                                        setBioSuggestion("");
                                                                    }}
                                                                    className="flex-1 bg-blue-600 text-white py-1 rounded-lg hover:bg-blue-700"
                                                                >
                                                                    Dùng gợi ý
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setBioSuggestion("")}
                                                                    className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white py-1 rounded-lg hover:bg-gray-300"
                                                                >
                                                                    Bỏ qua
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Submit / Cancel */}
                                                <div className="flex gap-2">
                                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                                        Lưu
                                                    </button>
                                                    <Dialog.Close asChild>
                                                        <button className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white py-2 rounded">
                                                            Huỷ
                                                        </button>
                                                    </Dialog.Close>
                                                </div>
                                            </form>

                                            <Dialog.Close asChild>
                                                <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#444]">
                                                    <Cross2Icon />
                                                </button>
                                            </Dialog.Close>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
                            </div>

                            {/* Profile details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <div><span className="font-semibold">Email:</span> {profile.email}</div>
                                <div><span className="font-semibold">SĐT:</span> {profile.phoneNumber}</div>
                                <div><span className="font-semibold">Địa chỉ: </span> {profile.address}</div>
                                <div><span className="font-semibold">Tiêu đề:</span> {profile.title}</div>
                            </div>

                            {profile.bio && (
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-semibold">Giới thiệu:</span> {profile.bio}
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
                    </section>

                    <section
                        id="education"
                        ref={(el) => (sectionRefs.current["education"] = el)}
                        className="section-block"
                    >
                        <EducationHistory />
                    </section>
                    <section
                        id="experience"
                        ref={(el) => (sectionRefs.current["experience"] = el)}
                        className="section-block"
                    >
                        <WorkExperience />
                    </section>
                    <section
                        id="skills"
                        ref={(el) => (sectionRefs.current["skills"] = el)}
                        className="section-block"
                    >
                        <Skill />
                    </section>
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-300 py-16">
                    Đang tải thông tin hồ sơ...
                </div>
            )}
        </main>
    </div>
);
}
