import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { MyUserContext, MyDispatcherContext } from "@contexts/MyContexts";
import Notifications from "@components/notifications/Notifications";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import {
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Bot } from "lucide-react";
import { cn } from "@/utils/cn";

// Button
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "px-4 py-2 rounded-pill shadow-soft font-semibold transition-all duration-200 border",
        "bg-beige-200 dark:bg-dark-bg-secondary",
        "text-softblack dark:text-dark-text-primary",
        "border-neutral-200 dark:border-dark-border-primary",
        "hover:bg-beige-300 dark:hover:bg-dark-bg-tertiary hover:shadow-soft-md",
        className
      )}
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
      className={cn(
        "p-2 rounded-pill shadow-soft border transition-all duration-200",
        "bg-beige-200 dark:bg-dark-bg-secondary",
        "border-neutral-200 dark:border-dark-border-primary",
        "hover:scale-110 hover:shadow-soft-md",
        className
      )}
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
        <div className={cn(
          "absolute right-0 mt-3 w-60",
          "bg-white dark:bg-dark-bg-secondary",
          "border border-neutral-200 dark:border-dark-border-primary",
          "rounded-card shadow-soft-lg z-30 overflow-hidden",
          "animate-dropdown"
        )}>
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
      className={cn(
        "px-6 py-4 cursor-pointer transition-colors duration-150",
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "hover:bg-beige-100 dark:hover:bg-dark-bg-tertiary"
      )}
    >
      {children}
    </li>
  );
}

function AIAvatar({ role }) {
  const roleTexts = {
    CANDIDATE: "Chào bạn, cùng tìm việc làm, công ty... và hơn thế nữa!",
    EMPLOYER: "Chào nhà tuyển dụng, cùng đăng tuyển dụng, quản lý ứng viên...",
    ADMIN: "Chào quản trị viên, cùng quản lý hệ thống, thống kê, ..."
  };

  const fullText = roleTexts[role] || roleTexts.CANDIDATE;
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  // Typing effect
  useEffect(() => {
    const speed = 80;
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
  }, [index, deleting, fullText]);

  // Observe dark mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-lg">
      <Bot className={cn(
        "w-7 h-7",
        isDark ? "text-dark-text-primary" : "text-softblack"
      )} />
      <span className={cn(
        isDark ? "text-dark-text-primary" : "text-softblack"
      )}>
        {displayText}<span className="animate-blink">|</span>
      </span>
    </div>
  );
}

function UserMenu({ user, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
    <>
      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        trigger={
          <Button
            className="flex items-center gap-2 bg-white dark:bg-dark-bg-secondary hover:bg-beige-100 dark:hover:bg-dark-bg-tertiary"
            onClick={() => setOpen((v) => !v)}
          >
            <Avatar size="sm" className="ring-2 ring-border">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="text-xs bg-beige-200 dark:bg-dark-bg-tertiary">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{user?.fullName?.split(" ")[0] || "Bạn"}</span>
            <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-dark-text-tertiary" />
          </Button>
        }
      >
        <ul className="text-base text-neutral-700 dark:text-dark-text-primary">
          {roleMenus[user.role]?.map((item) => (
            <DropdownItem key={item.to} onClick={() => navigate(item.to)}>
              {item.label}
            </DropdownItem>
          ))}
          <DropdownItem danger onClick={() => setShowConfirm(true)}>
            <LogOut className="inline-block mr-2 w-4 h-4" /> Đăng xuất
          </DropdownItem>
        </ul>
      </Dropdown>

      {/* Confirm logout dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div
            className="dialog-overlay"
            onClick={() => setShowConfirm(false)}
            aria-label="Close dialog"
          ></div>

          <div className={cn(
            "relative z-50 w-80",
            "bg-white dark:bg-dark-bg-secondary",
            "rounded-dialog shadow-soft-xl p-6",
            "flex flex-col items-center text-center",
            "animate-scaleIn"
          )}>
            <LogOut className="w-10 h-10 text-red-500 mb-3" />
            <h3 id="logout-title" className="text-lg font-semibold mb-2 text-softblack dark:text-dark-text-primary">
              Xác nhận đăng xuất
            </h3>
            <p className="mb-6 text-neutral-700 dark:text-dark-text-secondary text-sm">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </p>
            <div className="flex justify-center gap-4 w-full">
              <Button
                className="flex-1 bg-neutral-200 dark:bg-dark-bg-elevated text-neutral-800 dark:text-dark-text-primary hover:bg-neutral-300 dark:hover:bg-neutral-700"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-soft hover:shadow-soft-md"
                onClick={() => {
                  setShowConfirm(false);
                  onLogout();
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
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
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login");
  };


  return (
    <header className={cn(
      "flex justify-between items-center p-6",
      "bg-beige-100 dark:bg-dark-bg-primary",
      "text-softblack dark:text-dark-text-primary",
      "border-b border-transparent dark:border-dark-border-subtle",
      "transition-colors duration-200"
    )}>
      {/* Logo */}
      <div
        className="flex items-center gap-3 mr-8 select-none cursor-pointer group"
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
        <span className={cn(
          "w-10 h-10 rounded-xl shadow-soft",
          "bg-offblack dark:bg-beige-200",
          "flex items-center justify-center font-bold text-2xl",
          "text-white dark:text-softblack",
          "group-hover:scale-105 transition-transform duration-200"
        )}>
          FL
        </span>
        <span className={cn(
          "text-2xl font-bold tracking-tight",
          "text-offblack dark:text-dark-text-primary"
        )}>
          FlexiConnect
        </span>
      </div>

      {/* AI  */}
      <div className="flex-grow max-w-2xl mx-auto">
        <AIAvatar role={user?.role} />
      </div>




      {/* Right */}
      <div className="flex items-center gap-5 ml-8">
        {user?.role !== "ADMIN" && (
          <Button onClick={() => navigate("/employer-register")}>
            Bạn là nhà tuyển dụng?
          </Button>
        )}


        {!user && <Button onClick={() => navigate("/login")}>Đăng nhập</Button>}

        {/* Notifications */}
        {user?.role === "EMPLOYER" && <Notifications user={user} role="employer" />}
        {user?.role === "CANDIDATE" && <Notifications user={user} role="candidate" />}

        {/* Dark mode toggle */}
        <IconButton onClick={toggleDarkMode}>
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-700" />
          )}
        </IconButton>

        {/* User menu */}
        {user && <UserMenu user={user} onLogout={logout} />}
      </div>
    </header>
  );
}
