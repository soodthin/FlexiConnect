import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext, MyDispatcherContext } from "@contexts/MyContexts";
import cookie from "react-cookies";
import Notifications from "@components/notifications/Notifications";
import {
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

// Button
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-full shadow font-semibold transition border 
        bg-[#f5efe6] dark:bg-[#232323] text-[#222222] dark:text-[#f5efe6]
        border-[#d1d5db] dark:border-[#444]
        hover:bg-[#f5f5dc] dark:hover:bg-[#353535] ${className}`}
    >
      {children}
    </button>
  );
}

// IconButton (round)
function IconButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`p-2 rounded-full shadow border transition
        bg-[#f5efe6] dark:bg-[#232323] border-[#d1d5db] dark:border-[#444]
        hover:scale-110 ${className}`}
    >
      {children}
    </button>
  );
}

// Dropdown
function Dropdown({ open, onClose, children, trigger }) {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={ref}>
      {trigger}
      {open && (
        <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#232323] border border-gray-100 dark:border-[#444] rounded-2xl shadow-xl z-30 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

// DropdownItem
function DropdownItem({ onClick, children, danger }) {
  return (
    <li
      onClick={onClick}
      className={`px-6 py-4 cursor-pointer transition ${danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          : "hover:bg-[#f5efe6] dark:hover:bg-[#353535]"
        }`}
    >
      {children}
    </li>
  );
}

// Input (search box)
function Input({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center bg-white/90 dark:bg-[#232323] border border-gray-200 dark:border-[#333] rounded-full px-5 py-2.5 shadow transition">
      {Icon && <Icon className="text-gray-400 dark:text-gray-500 mr-3 text-lg" />}
      <input
        {...props}
        className="w-full text-base bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-[#222222] dark:text-[#f5efe6]"
      />
    </div>
  );
}



function AIAvatar() {
  const fullText = "Tìm việc làm, kỹ năng, công ty.... và hơn thế nữa!";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  // Typing effect
  useEffect(() => {
    const speed = 200;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplayText(fullText.slice(0, index + 1));
        setIndex(index + 1);
        if (index + 1 === fullText.length) setDeleting(true);
      } else {
        setDisplayText(fullText.slice(0, index - 1));
        setIndex(index - 1);
        if (index - 1 === 0) setDeleting(false);
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [index, deleting]);

  // Observe dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-lg">
      <Bot className={`w-7 h-7 ${isDark ? "text-[#f5efe6]" : "text-black"}`} />
      <span className={`${isDark ? "text-[#f5efe6]" : "text-[#222222]"}`}>
        {displayText}
        <span className="animate-blink">|</span>
      </span>

      <style jsx>{`
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}




function UserMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const roleMenus = {
    ADMIN: [
      { to: "/admin-pending-employers", label: "Duyệt nhà tuyển dụng" },
      { to: "/admin-users-management", label: "Quản lý người dùng" },
      { to: "/admin-jobposts-management", label: "Quản lý tin tuyển dụng" },
    ],
    CANDIDATE: [
      { to: "/candidate-profile", label: "Hồ sơ người dùng" },
      { to: "/applied", label: "Việc đã ứng tuyển" },
    ],
    EMPLOYER: [
      { to: "/employer-profile", label: "Hồ sơ công ty" },
      { to: "/employer-applications-management", label: "Ứng viên đã ứng tuyển" },
    ],
  };

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      trigger={
        <Button
          className="flex items-center gap-2 bg-white dark:bg-[#232323] hover:bg-[#f5efe6] dark:hover:bg-[#353535]"
          onClick={() => setOpen((v) => !v)}
        >
          <User className="text-xl text-[#6b7280] dark:text-[#aaa]" />
          <span className="font-medium">{user?.fullName?.split(" ")[0] || "Bạn"}</span>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </Button>
      }
    >
      <ul className="text-base text-gray-700 dark:text-[#f5efe6]">
        {roleMenus[user.role]?.map((item) => (
          <DropdownItem key={item.to} onClick={() => navigate(item.to)}>
            {item.label}
          </DropdownItem>
        ))}
        <DropdownItem danger onClick={onLogout}>
          <LogOut className="inline-block mr-2 w-4 h-4" /> Đăng xuất
        </DropdownItem>
      </ul>
    </Dropdown>
  );
}


export default function Header() {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatcherContext);
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

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

      {/* AI  */}
<div className="flex-grow max-w-2xl mx-auto">
  <AIAvatar />
</div>



      {/* Right */}
      <div className="flex items-center gap-5 ml-8">
        <Button onClick={() => navigate("/employer-register")}>
          Bạn là nhà tuyển dụng?
        </Button>

        {!user && <Button onClick={() => navigate("/login")}>Đăng nhập</Button>}

        {/* Notifications */}
        {user?.role === "EMPLOYER" && <Notifications user={user} role="employer" />}
        {user?.role === "CANDIDATE" && <Notifications user={user} role="candidate" />}

        {/* Dark mode toggle */}
        <IconButton onClick={toggleDarkMode}>
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </IconButton>

        {/* User menu */}
        {user && <UserMenu user={user} onLogout={logout} />}
      </div>
    </header>
  );
}
