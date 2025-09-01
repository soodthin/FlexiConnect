import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MyUserContext, MyDispatcherContext } from "@contexts/MyContexts";
import cookie from "react-cookies";
import Notifications from "@components/notifications/Notifications";

export default function Header() {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const userMenuRef = useRef();

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // reset dropdown khi đổi user
  useEffect(() => setShowUserMenu(false), [user]);

  // click outside -> đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  const logout = () => {
    cookie.remove("token");
    dispatch({ type: "logout" });
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center p-6 bg-[#f7f6f3] dark:bg-[#181818] font-inter text-[#222222] dark:text-[#f5efe6]">

      {/* Logo */}
      <div
        className="flex items-center gap-3 mr-8 select-none cursor-pointer"
        onClick={() => {
          if (!user) return navigate("/");
          const roleRoutes = {
            CANDIDATE: "/candidate-dashboard",
            EMPLOYER: "/employer-dashboard",
            ADMIN: "/admin-dashboard",
          };
          navigate(roleRoutes[user.role] || "/");
        }}
      >
        <span className="w-10 h-10 rounded-xl shadow bg-[#111111] flex items-center justify-center font-bold text-white text-2xl">
          FL
        </span>
        <span className="text-2xl font-bold tracking-tight text-[#111111] dark:text-[#f5efe6]">
          FlexiConnect
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-grow max-w-2xl mx-auto">
        <div className="flex items-center bg-white/90 dark:bg-[#232323] border border-gray-200 dark:border-[#333] rounded-full px-5 py-2.5 shadow transition">
          <FaSearch className="text-gray-400 dark:text-gray-500 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Tìm việc làm, kỹ năng, công ty..."
            className="w-full text-base bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[#222222] dark:text-[#f5efe6]"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 ml-8">
        <button
          onClick={() => navigate("/employer-register")}
          className="text-sm px-4 py-2 bg-[#f5efe6] dark:bg-[#232323] rounded-full shadow hover:bg-[#f5f5dc] dark:hover:bg-[#353535] text-[#222222] dark:text-[#f5efe6] font-semibold border border-[#d1d5db] dark:border-[#444] transition"
        >
          Bạn là nhà tuyển dụng?
        </button>

        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="text-sm px-4 py-2 bg-[#f5efe6] dark:bg-[#232323] rounded-full shadow hover:bg-[#f5f5dc] dark:hover:bg-[#353535] text-[#222222] dark:text-[#f5efe6] font-semibold border border-[#d1d5db] dark:border-[#444] transition"
          >
            Đăng nhập
          </button>
        )}

        {/* Notifications */}
        {user?.role === "EMPLOYER" && (
          <Notifications user={user} role="employer" />
        )}
        {user?.role === "CANDIDATE" && (
          <Notifications user={user} role="candidate" />
        )}

        {/* Dark mode toggle */}
        <button
          className="p-2 rounded-full bg-[#f5efe6] dark:bg-[#232323] border border-[#d1d5db] dark:border-[#444] shadow hover:scale-110 transition"
          onClick={toggleDarkMode}
        >
          {isDark ? (
            <FaSun className="text-xl text-yellow-400" />
          ) : (
            <FaMoon className="text-xl text-gray-700" />
          )}
        </button>

        {/* User Menu */}
        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#444] rounded-full shadow hover:bg-[#f5efe6] dark:hover:bg-[#353535] transition"
              onClick={() => setShowUserMenu((v) => !v)}
            >
              <FaUser className="text-xl text-[#6b7280] dark:text-[#aaa]" />
              <span className="font-medium">
                {user?.fullName?.split(" ")[0] || "Bạn"}
              </span>
              <IoIosArrowDown className="text-gray-500 dark:text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#232323] border border-gray-100 dark:border-[#444] rounded-2xl shadow-xl z-30 overflow-hidden">
                <ul className="text-base text-gray-700 dark:text-[#f5efe6]">
                  {user.role === "ADMIN" && (
                    <>
                      <MenuItem to="/admin-pending-employers" label="Duyệt nhà tuyển dụng" />
                      <MenuItem to="/admin-users-management" label="Quản lý người dùng" />
                      <MenuItem to="/admin-jobposts-management" label="Quản lý tin tuyển dụng" />
                    </>
                  )}
                  {user.role === "CANDIDATE" && (
                    <>
                      <MenuItem to="/candidate-profile" label="Hồ sơ người dùng" />
                      <MenuItem to="/applied" label="Việc đã ứng tuyển" />
                    </>
                  )}
                  {user.role === "EMPLOYER" && (
                    <>
                      <MenuItem to="/employer-profile" label="Hồ sơ công ty" />
                      <MenuItem to="/employer-jobposts-management" label="Quản lý tin tuyển dụng" />
                      <MenuItem to="/employer-applications-management" label="Ứng viên đã ứng tuyển" />
                    </>
                  )}
                  <li
                    className="px-6 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/* 🔹 Sub Component cho Menu Item */
function MenuItem({ to, label }) {
  const navigate = useNavigate();
  return (
    <li
      onClick={() => navigate(to)}
      className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer"
    >
      {label}
    </li>
  );
}
