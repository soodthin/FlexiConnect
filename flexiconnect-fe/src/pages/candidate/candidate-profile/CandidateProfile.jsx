import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import EducationHistory from "@candidateProfile/EducationHistory";
import Skill from "@candidateProfile/Skill";
import WorkExperience from "@candidateProfile/WorkExperience";
import classNames from "classnames";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";

const SECTIONS = [
  { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
  { id: "education", label: "Học vấn", icon: "🎓" },
  { id: "experience", label: "Kinh nghiệm", icon: "💼" },
  { id: "skills", label: "Kỹ năng - AI", icon: "🛠️" },
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
    bio: ""
  });

  const sectionRefs = useRef({});
  const navigate = useNavigate();
  const profileCompletion = 78;

  useEffect(() => {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["candidate-profile"]);
      setProfile(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (scrollTarget) {
      const el = sectionRefs.current[scrollTarget];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollTarget("");
    }
  }, [scrollTarget]);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = SECTIONS.map(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      setCurrentSection(offsets[0].id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã copy link hồ sơ vào clipboard!");
  };

  const handlePreview = () => {
    window.open("/preview-profile", "_blank");
  };

  const handleDownloadPDF = () => {
    alert("Chức năng tải PDF sẽ được cập nhật!");
  };

 const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const form = new FormData();
    form.append("avatar", file);

    await authApis().post(endpoints["candidate-avatar"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    const res = await authApis().get(endpoints["candidate-profile"]);
    setProfile(res.data);
   setAvatarTimestamp(Date.now()); 

      toast.success("✅ Ảnh đại diện đã được cập nhật!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi cập nhật ảnh đại diện.");
    }
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authApis().put(endpoints["candidate-profile"], {
        ...form,
        avatar: profile.avatar,
      });
      toast.success("✅ Đã cập nhật thông tin!");
      await loadProfile();
    } catch (err) {
      console.error(err);
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
  };

  return (
    <div className="w-full min-h-screen flex bg-beige-light dark:bg-[#181818]">
      <aside className="hidden sm:flex flex-col gap-2 w-56 h-screen sticky top-0 left-0 bg-white dark:bg-[#232323] p-4 border-r border-neutral-300 dark:border-neutral-700">
        <button
          onClick={() => navigate("/candidate-dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-beige dark:bg-beige dark:text-black font-semibold shadow hover:bg-gray-800 dark:hover:bg-[#f5f5dc] transition text-xs"
        >
          ← Quay về
        </button>
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setScrollTarget(sec.id)}
            className={classNames(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition text-sm",
              currentSection === sec.id
                ? "bg-black dark:bg-beige text-beige dark:text-black shadow"
                : "bg-gray-100 dark:bg-[#353535] text-gray-600 dark:text-beige hover:bg-beige-light hover:text-black dark:hover:text-white"
            )}
          >
            <span>{sec.icon}</span> {sec.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 text-gray-800 dark:text-gray-100">
        <div className="flex flex-wrap gap-3 items-center mb-6">
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
              className="bg-white dark:bg-[#232323] rounded-xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              {/* Avatar + Upload */}
              <div className="relative w-24 h-24 shrink-0">
                <img
                  src={
                    profile.avatar
                      ? `${profile.avatar}?t=${avatarTimestamp}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || "Candidate")}`
                  }
                  alt="Avatar"
                  className="rounded-full w-20 h-20 object-cover border-2 border-white shadow"
                />

                <label className="absolute bottom-0 right-0 bg-white dark:bg-[#333] rounded-full shadow p-1 cursor-pointer text-xs">
                  📷
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Thông tin cá nhân */}
              <div className="flex-1 space-y-2 text-left">
                <div className="flex items-center gap-2 justify-between">
                  <h2 className="text-2xl font-bold text-[#111] dark:text-beige">{profile.fullName}</h2>
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        onClick={handleOpenEdit}
                      >
                        <Pencil2Icon className="w-3 h-3" />
                        Chỉnh sửa
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                      <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#2d2d2d] text-black dark:text-white p-8 shadow-xl z-50">
                        <Dialog.Title className="text-2xl font-bold mb-4">Cập nhật thông tin</Dialog.Title>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <input className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]" placeholder="Họ tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                          <input className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]" placeholder="Số điện thoại" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                          <input className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                          <input className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]" placeholder="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                          <textarea className="w-full px-4 py-2 rounded border dark:bg-[#3a3a3a]" placeholder="Giới thiệu ngắn" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                          <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Lưu</button>
                            <Dialog.Close asChild>
                              <button type="button" className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white py-2 rounded">Huỷ</button>
                            </Dialog.Close>
                          </div>
                        </form>
                        <Dialog.Close asChild>
                          <button className="absolute right-4 top-4 p-2 hover:bg-gray-200 dark:hover:bg-[#444] rounded-full">
                            <Cross2Icon />
                          </button>
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <div><span className="font-semibold">Email:</span> {profile.email}</div>
                  <div><span className="font-semibold">SĐT:</span> {profile.phoneNumber}</div>
                  <div><span className="font-semibold">Địa chỉ:</span> {profile.address}</div>
                  <div><span className="font-semibold">Tiêu đề:</span> {profile.title}</div>
                </div>

                {profile.bio && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Giới thiệu:</span> {profile.bio}
                  </div>
                )}

                {profile.resumeFile && (
                  <a
                    className="inline-block mt-3 px-4 py-2 bg-beige dark:bg-[#282828] text-[#111] dark:text-beige rounded-full text-xs font-semibold shadow hover:underline"
                    href={profile.resumeFile}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📄 Xem CV hiện tại
                  </a>
                )}
              </div>
            </section>


            <section id="education" ref={(el) => (sectionRefs.current["education"] = el)} className="section-block">
              <EducationHistory />
            </section>

            <section id="workexperience" ref={(el) => (sectionRefs.current["workexperience"] = el)} className="section-block">
              <WorkExperience />
            </section>

            <section id="skills" ref={(el) => (sectionRefs.current["skills"] = el)} className="section-block">
              <Skill />
            </section>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300 py-16">Đang tải thông tin hồ sơ...</div>
        )}
      </main>
    </div>
  );
}
