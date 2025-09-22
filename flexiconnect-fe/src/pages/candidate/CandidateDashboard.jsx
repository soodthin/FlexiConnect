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

  const Card = ({ className = "", children }) => (
    <div
      className={`rounded-2xl shadow-md border border-gray-200 dark:border-[#333] 
      bg-white dark:bg-[#232323] transition ${className}`}
    >
      {children}
    </div>
  );

  const CardContent = ({ className = "", children }) => (
    <div className={`p-8 ${className}`}>{children}</div>
  );

  const Button = ({ className = "", children, ...props }) => (
    <button
      className={`px-5 py-3 rounded-xl font-medium shadow hover:shadow-lg 
      bg-gradient-to-r from-black to-gray-700 dark:from-[#f5efe6] dark:to-[#ccc] 
      text-white dark:text-black transition-all duration-300 hover:scale-[1.03] 
      ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const Dropdown = ({ children, className = "" }) => (
    <div
      className={`absolute bottom-20 right-0 w-64 rounded-2xl shadow-lg border 
      bg-white dark:bg-[#2a2a2a] dark:border-[#444] p-4 space-y-2 animate-fade-in-up 
      ${className}`}
    >
      {children}
    </div>
  );

  const DropdownItem = ({ children, ...props }) => (
    <button
      className="w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-lg 
      text-sm font-medium bg-gray-50 dark:bg-[#353535] 
      hover:bg-gray-100 dark:hover:bg-[#444] transition"
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
      const userString = localStorage.getItem("user");

      const userData = userString ? JSON.parse(userString) : null;

      const token = userData ? userData.token : null;

      if (!token) {
        console.log("Không tìm thấy token, dừng thực thi.");
        return;
      }
      
      const res = await authApis().get(endpoints["current-user"]); 
      setUser(res.data);

    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };
  loadUser();
}, [navigate]);

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
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#181818] font-inter text-[#222] dark:text-[#f5efe6] transition-all">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Section */}
        {user?.role === "CANDIDATE" && (
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[#111] via-[#6b7280] to-[#f5efe6] dark:from-[#f5efe6] dark:via-[#aaa] dark:to-[#444] text-transparent bg-clip-text">
                  Chào {user?.fullName || "Ứng viên"}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                  Khám phá công việc mơ ước của bạn ngay hôm nay với hàng ngàn cơ hội hấp dẫn.
                </p>

              </div>
              <div className="flex flex-col items-center md:items-start gap-3">
                <Button
                  className="px-4 py-2 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => navigate("/candidate-profile")}
                >
                  Cập nhật hồ sơ để ứng tuyển ngay
                </Button>

                <span className="text-gray-500 dark:text-gray-400 font-medium my-1">hay bạn muốn?</span>

                <Button
                  className="px-4 py-2 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => navigate("/candidate-upgrade")}
                >
                  Trải nghiệm chức năng AI
                </Button>
              </div>




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
              <p className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Bot className="w-4 h-4" />
                Trợ lý AI
              </p>
              <DropdownItem onClick={() => navigate("/candidate-profile")}>
                <FileText className="w-4 h-4" /> Viết lại mô tả CV
              </DropdownItem>
              <DropdownItem onClick={() => navigate("/mock-interview")}>
                <Mic className="w-4 h-4" /> Luyện phỏng vấn
              </DropdownItem>
              <DropdownItem onClick={() => navigate("/candidate-upgrade")}>
                <Target className="w-4 h-4" /> Nâng cấp tài khoản AI
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      )}
    </div>
  );
}
