import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MyUserContext, MyDispatcherContext } from '@contexts/MyContexts';

import cookie from "react-cookies";

export default function Header() {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  const userMenuRef = useRef();

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
    setShowUserMenu(false);
  }, [user]);

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
          if (user.role === "CANDIDATE") navigate("/candidate-dashboard");
          else if (user.role === "EMPLOYER") navigate("/employer-dashboard");
          else if (user.role === "ADMIN") navigate("/admin-dashboard");
          else navigate("/");
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

        {/* Only show login button when user is not logged in */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="text-sm px-4 py-2 bg-[#f5efe6] dark:bg-[#232323] rounded-full shadow hover:bg-[#f5f5dc] dark:hover:bg-[#353535] text-[#222222] dark:text-[#f5efe6] font-semibold border border-[#d1d5db] dark:border-[#444] transition"
          >
            Đăng nhập
          </button>
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

        {/* User Dropdown: Only show when user is logged in */}
        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#444] rounded-full shadow hover:bg-[#f5efe6] dark:hover:bg-[#353535] transition"
              onClick={() => setShowUserMenu((v) => !v)}
            >
              <FaUser className="text-xl text-[#6b7280] dark:text-[#aaa]" />
              <span className="font-medium">{user?.fullName?.split(" ")[0] || "Bạn"}</span>
              <IoIosArrowDown className="text-gray-500 dark:text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#232323] border border-gray-100 dark:border-[#444] rounded-2xl shadow-xl z-30 overflow-hidden">
                <ul className="text-base text-gray-700 dark:text-[#f5efe6]">
                  {/*ROLE_ADMIN*/}
                  {user.role === "ADMIN" && (
                    <>
                      <li onClick={() => navigate("/admin-pending-employers")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Duyệt nhà tuyển dụng</li>
                      <li onClick={() => navigate("/admin-users-management")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Quản lý người dùng</li>
                      <li onClick={() => navigate("/admin-jobposts-management")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Quản lý tin tuyển dụng</li>
                    </>
                  )}
                  {/* ROLE_CANDIDATE */}
                  {user.role === "CANDIDATE" && (
                    <>
                      <li onClick={() => navigate("/candidate-profile")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Hồ sơ người dùng</li>
                      <li onClick={() => navigate("/applied-jobs")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Việc đã ứng tuyển</li>
                      <li onClick={() => navigate("/notifications")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Thông báo</li>
                    </>
                  )}

                  {/* ROLE_EMPLOYER */}
                  {user.role === "EMPLOYER" && (
                    <>
                      <li onClick={() => navigate("/employer-profile")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Hồ sơ công ty</li>
                      <li onClick={() => navigate("/employer-jobposts-management")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Quản lý tin tuyển dụng</li>
                      <li onClick={() => navigate("/employer-job-applications")} className="px-6 py-4 hover:bg-[#f5efe6] dark:hover:bg-[#353535] cursor-pointer">Ứng viên đã ứng tuyển</li>
                    </>
                  )}



                  {/* Common: Logout */}
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