import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import JobPostList from "@public/JobPostList";
import { Bot, FileText, Target, Mic } from "lucide-react";

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");

  const aiMenuRef = useRef();
  const navigate = useNavigate();

  // 🔹 UI Primitives
  const Card = ({ className = "", children }) => (
    <div className={`rounded-2xl shadow-lg border bg-white dark:bg-[#232323] ${className}`}>
      {children}
    </div>
  );
  const CardContent = ({ className = "", children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
  );
  const Button = ({ className = "", children, ...props }) => (
    <button
      className={`px-6 py-3 rounded-full font-medium shadow-md hover:scale-105 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
  const Dropdown = ({ children, className = "" }) => (
    <div className={`absolute bottom-20 right-0 w-64 rounded-2xl shadow-xl p-4 border bg-[#f5efe6] dark:bg-[#232323] dark:border-[#444] animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
  const DropdownItem = ({ children, ...props }) => (
    <button
      className="w-full text-left px-3 py-2 bg-white dark:bg-[#353535] hover:bg-[#f5f5dc] dark:hover:bg-[#444] rounded-lg text-sm font-medium transition"
      {...props}
    >
      {children}
    </button>
  );

  // Theme setup
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await authApis().get(endpoints["current-user"], {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, [navigate]);

  // Close AI menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target)) {
        setShowAiMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f6f3] dark:bg-[#181818] font-inter text-[#222] dark:text-[#f5efe6] transition-all">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        {user?.role === "CANDIDATE" && (
          <Card className="bg-gradient-to-br from-[#fdf6ec] via-[#f7f0e7] to-[#f3e9df] dark:from-[#2a2a2a] dark:via-[#232323] dark:to-[#1a1a1a]">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-3 tracking-tight bg-gradient-to-r from-[#111] via-[#6b7280] to-[#f5efe6] dark:from-[#f5efe6] dark:via-[#aaa] dark:to-[#444] text-transparent bg-clip-text">
                  Chào {user?.fullName || "Ứng viên"}! 👋
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 max-w-xl">
                  Khám phá công việc mơ ước của bạn ngay hôm nay với hàng ngàn cơ hội hấp dẫn.
                </p>
                <Button
                  onClick={() => navigate("/candidate-profile")}
                  className="bg-black dark:bg-[#f5efe6] text-white dark:text-black"
                >
                  Cập nhật hồ sơ để ứng tuyển ngay
                </Button>
              </div>
              <img
                src="/assets/job-hunt.svg"
                alt="Job search illustration"
                className="w-56 md:w-72 drop-shadow-lg hidden md:block"
              />
            </CardContent>
          </Card>
        )}

        {/* Job List */}
        <section>
          <JobPostList />
        </section>
      </main>

      {/* Floating AI Assistant */}
      {user?.role === "CANDIDATE" && (
        <div className="fixed bottom-8 right-8 z-50" ref={aiMenuRef}>
          {/* AI Button */}
          <button
            className="bg-gradient-to-r from-[#111111] to-[#444] dark:from-[#f5efe6] dark:to-[#ccc] text-white dark:text-black p-5 rounded-full shadow-xl hover:scale-110 transition-all duration-300 border-4 border-white dark:border-[#232323] animate-pulse"
            onClick={() => setShowAiMenu((v) => !v)}
          >
            <Bot className="w-6 h-6" />
          </button>

          {/* Compact Floating Menu */}
          {showAiMenu && (
            <Dropdown>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#6b7280] dark:text-[#f5efe6]" />
                Trợ lý AI
              </p>
              <div className="space-y-2">
                <DropdownItem onClick={() => navigate("/candidate-profile")}>
                  <FileText className="inline-block w-4 h-4 mr-2" /> Viết lại mô tả CV
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/ai-interview")}>
                  <Mic className="inline-block w-4 h-4 mr-2" /> Luyện phỏng vấn
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/candidate-upgrade")}>
                  <Bot className="inline-block w-4 h-4 mr-2" /> Nâng cấp tài khoản AI
                </DropdownItem>

              </div>
            </Dropdown>
          )}
        </div>
      )}
    </div>
  );
}
