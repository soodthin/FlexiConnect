import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/APIs";
import { FaRobot } from "react-icons/fa";
import JobPostList from "../Public/JobPostList";

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [, setShowUserMenu] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const userMenuRef = useRef();
  const aiMenuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await authApis().get(endpoints["current-user"], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, [navigate]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target)) {
        setShowAiMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f6f3] dark:bg-[#181818] px-6 py-6 font-inter text-[#222222] dark:text-[#f5efe6] transition-all">
      <main className="text-[#222222] dark:text-[#f5efe6] max-w-6xl mx-auto">
        {user?.role === "CANDIDATE" && (
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-[#111111] via-[#6b7280] to-[#f5efe6] dark:from-[#f5efe6] dark:via-[#888] dark:to-[#232323] text-transparent bg-clip-text">
              Chào {user?.fullName || "Ứng viên"}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Hãy khám phá công việc mơ ước của bạn ngay hôm nay.
            </p>
          </div>
        )}
        <JobPostList />
      </main>

      {user?.role === "CANDIDATE" && (
        <div className="fixed bottom-8 right-8 z-50" ref={aiMenuRef}>
          <button
            className="bg-black dark:bg-[#f5efe6] text-white dark:text-black p-5 rounded-full shadow-xl hover:scale-110 transition-all duration-300 border-4 border-white dark:border-[#232323]"
            onClick={() => setShowAiMenu((v) => !v)}
          >
            <FaRobot className="text-2xl" />
          </button>

          {showAiMenu && (
            <div className="absolute bottom-20 right-0 w-72 bg-[#f5efe6] dark:bg-[#232323] shadow-2xl rounded-3xl p-6 space-y-3 border border-[#d1d5db] dark:border-[#444] z-50 animate-fade-in-up">
              <p className="text-base text-[#111111] dark:text-[#f5efe6] font-semibold mb-3 flex items-center gap-2">
                <FaRobot className="text-[#6b7280] dark:text-[#f5efe6]" />
                Trợ lý AI
              </p>
              <button
                className="block w-full text-left px-4 py-3 mb-1 bg-white dark:bg-[#353535] hover:bg-[#f5f5dc] dark:hover:bg-[#444] rounded-lg text-sm text-[#222222] dark:text-[#f5efe6] font-medium transition"
                onClick={() => navigate("/ai-cv")}
              >
                ✍️ Viết lại mô tả CV
              </button>
              <button
                className="block w-full text-left px-4 py-3 mb-1 bg-white dark:bg-[#353535] hover:bg-[#f5f5dc] dark:hover:bg-[#444] rounded-lg text-sm text-[#222222] dark:text-[#f5efe6] font-medium transition"
                onClick={() => navigate("/ai-job-recommend")}
              >
                🎯 Gợi ý việc làm
              </button>
              <button
                className="block w-full text-left px-4 py-3 bg-white dark:bg-[#353535] hover:bg-[#f5f5dc] dark:hover:bg-[#444] rounded-lg text-sm text-[#222222] dark:text-[#f5efe6] font-medium transition"
                onClick={() => navigate("/ai-interview")}
              >
                🎤 Luyện phỏng vấn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
