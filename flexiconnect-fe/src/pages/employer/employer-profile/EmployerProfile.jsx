import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import CompanyInfo from "@employerProfile/CompanyInfo";
import CompanyIntro from "@employerProfile/CompanyIntro";
import classNames from "classnames";
import { toast } from "sonner";
import { ArrowLeft, Camera } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#232323] rounded-xl shadow ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const IconButton = ({ children, className = "", ...props }) => (
  <button
    className={`p-2 rounded-lg flex items-center gap-1 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

/* ---------------------- 🧩 FEATURE COMPONENT ---------------------- */
const SECTIONS = [
  { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
  { id: "company", label: "Thông tin công ty", icon: "🏢" },
  { id: "intro", label: "Giới thiệu công ty", icon: "📝" },
];

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [scrollTarget, setScrollTarget] = useState("");
  const [currentSection, setCurrentSection] = useState("profile");
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const profileCompletion = 85;

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["employer-profile"]);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await authApis().post(endpoints["employer-avatar"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadProfile();
      setAvatarTimestamp(Date.now());
      toast.success("✅ Ảnh đại diện đã được cập nhật!");
    } catch {
      toast.error("❌ Lỗi khi cập nhật ảnh đại diện.");
    }
  };

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

  return (
    <div className="w-full min-h-screen flex bg-beige-light dark:bg-[#181818]">
      {/* Sidebar Navigation */}
      <aside className="hidden sm:flex flex-col gap-2 w-56 h-screen sticky top-0 left-0 bg-white dark:bg-[#232323] p-4 border-r border-neutral-300 dark:border-neutral-700">
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-black text-beige dark:bg-beige dark:text-black shadow hover:bg-gray-800 dark:hover:bg-[#f5f5dc] text-xs"
        >
          <ArrowLeft size={14} /> Quay về
        </Button>
        {SECTIONS.map((sec) => (
          <Button
            key={sec.id}
            onClick={() => setScrollTarget(sec.id)}
            className={classNames(
              "flex items-center gap-2 text-sm",
              currentSection === sec.id
                ? "bg-black dark:bg-beige text-beige dark:text-black shadow"
                : "bg-gray-100 dark:bg-[#353535] text-gray-600 dark:text-beige hover:bg-beige-light hover:text-black dark:hover:bg-[#3a3a3a]"
            )}
          >
            <span>{sec.icon}</span> {sec.label}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
        {/* Progress bar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-300">
              Hoàn thiện hồ sơ
            </span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-[#282828] rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-600 font-bold ml-1">
              {profileCompletion}%
            </span>
          </div>
        </div>

        {profile ? (
          <div className="flex flex-col gap-8">
            {/* Header */}
            <section
              id="profile"
              ref={(el) => (sectionRefs.current["profile"] = el)}
            >
              <Card className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24">
                  <img
                    src={
                      profile.avatar
                        ? `${profile.avatar}?t=${avatarTimestamp}`
                        : "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(profile.fullName || "Employer")
                    }
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-beige dark:border-beige"
                  />
                  <label className="absolute bottom-0 right-0 p-1 bg-white dark:bg-[#333] rounded-full shadow cursor-pointer text-sm">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-[#111] dark:text-beige flex items-center gap-3">
                    {profile.fullName}
                    {profile.isVerified ? (
                      <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 dark:bg-green-700 dark:text-green-100 rounded-full">
                        Đã xác minh ✅
                      </span>
                    ) : (
                      <span
                        className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 dark:bg-red-700 dark:text-red-100 rounded-full"
                        title={profile.reasonReject || "Chưa được xác minh"}
                      >
                        Chưa xác minh ❌
                      </span>
                    )}
                  </h2>

                  {/* Follower */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#353535] rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4h4M3 5h4v4H3V5zm0 8v4h4m-4-2h4m8-8v4h4M15 5h4v4h-4V5zm0 8v4h4m-4-2h4"
                        />
                      </svg>
                      <span className="font-semibold">
                        {profile.follower || 0}
                      </span>
                      <span>followers</span>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Company info */}
            <section
              id="company"
              ref={(el) => (sectionRefs.current["company"] = el)}
            >
              <CompanyInfo
                profile={profile}
                onUpdated={(newProfile) => setProfile(newProfile)}
              />
            </section>

            {/* Company Intro */}
            <section
              id="intro"
              ref={(el) => (sectionRefs.current["intro"] = el)}
            >
              <CompanyIntro profile={profile} />
            </section>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-16">
            Đang tải thông tin hồ sơ nhà tuyển dụng...
          </div>
        )}
      </main>
    </div>
  );
}
