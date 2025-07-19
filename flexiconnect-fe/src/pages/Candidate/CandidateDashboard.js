import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { authApis, endpoints } from "../../configs/APIs";
import { FaUser, FaSearch, FaSignOutAlt, FaRobot } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    cookie.remove("token");
    navigate("/login");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApis().get(endpoints["current-user"]);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    loadUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-6 py-6 relative text-gray-800 transition-all">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        {/* Search Bar */}
        <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-4 py-2 w-full max-w-xl shadow-sm transition focus-within:ring-2 focus-within:ring-beige-500">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm việc làm, kỹ năng, công ty..."
            className="w-full text-sm bg-transparent outline-none"
          />
        </div>

        {/* Right Side: Employer link + User menu */}
        <div className="flex items-center gap-4 ml-6">
          <button
            onClick={() => navigate("/employer-register")}
            className="text-sm text-gray-600 hover:text-black hover:underline transition"
          >
            <span className="font-semibold">Bạn là nhà tuyển dụng?</span>
          </button>

          {/* User Icon + Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 hover:opacity-80 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser className="text-xl text-gray-700" />
              <IoIosArrowDown className="text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-30 animate-fade-in-up">
                <ul className="text-sm text-gray-700 divide-y">
                  <li
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/candidate-profile")}
                  >
                    Hồ sơ người dùng
                  </li>
                  <li
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/applied-jobs")}
                  >
                    Việc đã ứng tuyển
                  </li>
                  <li
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/notifications")}
                  >
                    Thông báo từ công ty
                  </li>
                  <li
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/upgrade")}
                  >
                    Nâng cấp tài khoản
                  </li>
                  <li
                    className="px-4 py-3 text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-gray-800">
        <h2 className="text-3xl font-semibold mb-2 tracking-tight">
          👋 Chào {user?.fullName || "ứng viên"}!
        </h2>
        <p className="text-gray-600 text-base mb-6">
          Tìm việc mơ ước của bạn ngay hôm nay.
        </p>

        <section className="bg-white rounded-2xl shadow p-6 text-center text-gray-400 border border-dashed border-gray-300 min-h-[200px] flex items-center justify-center transition-all">
          🔍 Kết quả tìm kiếm hoặc gợi ý việc làm sẽ hiển thị ở đây...
        </section>
      </main>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          onClick={() => setShowAiMenu(!showAiMenu)}
        >
          <FaRobot className="text-xl" />
        </button>

        {showAiMenu && (
          <div className="absolute bottom-16 right-0 w-64 bg-white shadow-xl rounded-2xl p-4 space-y-2 border z-50 animate-fade-in-up">
            <p className="text-sm text-gray-500 font-semibold mb-2">⚙️ Trợ lý AI</p>
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition"
              onClick={() => navigate("/ai-cv")}
            >
              ✍️ Viết lại mô tả CV
            </button>
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition"
              onClick={() => navigate("/ai-job-recommend")}
            >
              🎯 Gợi ý việc làm
            </button>
            <button
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition"
              onClick={() => navigate("/ai-interview")}
            >
              🎤 Luyện phỏng vấn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
