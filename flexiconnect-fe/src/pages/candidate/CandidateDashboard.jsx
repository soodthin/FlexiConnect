import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApis, endpoints } from "@configs/APIs";
import JobPostList from "@public/JobPostList";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import {
  Bot,
  FileText,
  Target,
  Mic,
  ArrowRight,
  Sparkles,
  Briefcase,
  TrendingUp,
  Crown,
  X,
} from "lucide-react";

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, trend, className }) => (
  <div className={cn(
    "flex items-center gap-3 p-4 rounded-xl bg-white/60 dark:bg-dark-bg-secondary/60 backdrop-blur-sm border border-border/50",
    className
  )}>
    <div className="p-2.5 rounded-lg bg-beige-200 dark:bg-dark-bg-tertiary">
      <Icon className="w-5 h-5 text-beige-700 dark:text-beige-300" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">{value}</span>
        {trend && (
          <span className="text-xs text-success-600 dark:text-success-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

// AI Assistant Menu Item
const AIMenuItem = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors hover:bg-muted group"
  >
    <div className="p-2 rounded-lg bg-beige-100 dark:bg-dark-bg-tertiary group-hover:bg-beige-200 dark:group-hover:bg-dark-bg-elevated transition-colors">
      <Icon className="w-4 h-4 text-beige-700 dark:text-beige-300" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
  </button>
);

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isDark] = useState(() => localStorage.getItem("theme") === "dark");

  const aiMenuRef = useRef();
  const navigate = useNavigate();

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

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background font-inter text-foreground transition-all">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section for Candidates */}
        {user?.role === "CANDIDATE" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-beige-100 via-beige-50 to-white dark:from-dark-bg-secondary dark:via-dark-bg-primary dark:to-dark-bg-tertiary border border-border shadow-soft-lg"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-beige-200/50 dark:bg-beige-800/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-beige-300/30 dark:bg-beige-700/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar size="2xl" className="ring-4 ring-white dark:ring-dark-bg-secondary shadow-soft-lg">
                    <AvatarImage src={user?.avatar} alt={user?.fullName} />
                    <AvatarFallback className="text-xl bg-beige-200 dark:bg-dark-bg-tertiary">
                      {getInitials(user?.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Chào {user?.fullName || "Ứng viên"}!
                      </h1>
                      {user?.isPremium && (
                        <Badge variant="warning" className="gap-1">
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      Khám phá công việc mơ ước của bạn ngay hôm nay
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
                  <Button
                    size="lg"
                    onClick={() => navigate("/candidate-profile")}
                    className="gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Cập nhật hồ sơ
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/candidate-upgrade")}
                    className="gap-2 bg-white/50 dark:bg-dark-bg-secondary/50 backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Trải nghiệm AI
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <StatCard
                  icon={Briefcase}
                  label="Việc làm đã ứng tuyển"
                  value={user?.applicationCount || 0}
                />
                <StatCard
                  icon={FileText}
                  label="CV đã tải lên"
                  value={user?.cvCount || 1}
                />
                <StatCard
                  icon={Target}
                  label="Việc làm phù hợp"
                  value="12+"
                  trend="+5%"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Lượt xem hồ sơ"
                  value={user?.profileViews || 0}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Việc làm mới nhất</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Hàng ngàn cơ hội việc làm đang chờ đợi bạn
            </p>
          </div>
        </div>

        {/* Job List */}
        <section>
          <JobPostList />
        </section>
      </main>

      {/* Floating AI Assistant */}
      {user?.role === "CANDIDATE" && (
        <div className="fixed bottom-6 right-6 z-50" ref={aiMenuRef}>
          {/* AI Menu Popup */}
          <AnimatePresence>
            {showAiMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 w-80 rounded-2xl bg-card border border-border shadow-soft-xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-beige-500 to-beige-700 dark:from-beige-400 dark:to-beige-600">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Trợ lý AI</p>
                        <p className="text-xs text-muted-foreground">Sẵn sàng hỗ trợ bạn</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAiMenu(false)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <AIMenuItem
                    icon={FileText}
                    title="Viết lại mô tả CV"
                    description="AI giúp tối ưu nội dung CV của bạn"
                    onClick={() => {
                      navigate("/candidate-profile");
                      setShowAiMenu(false);
                    }}
                  />
                  <AIMenuItem
                    icon={Mic}
                    title="Luyện phỏng vấn"
                    description="Thực hành phỏng vấn với AI"
                    onClick={() => {
                      navigate("/mock-interview");
                      setShowAiMenu(false);
                    }}
                  />
                  <AIMenuItem
                    icon={Target}
                    title="Nâng cấp tài khoản"
                    description="Mở khóa tất cả tính năng AI"
                    onClick={() => {
                      navigate("/candidate-upgrade");
                      setShowAiMenu(false);
                    }}
                  />
                </div>

                {/* Footer */}
                {!user?.isPremium && (
                  <div className="p-3 border-t border-border bg-gradient-to-r from-beige-50 to-beige-100 dark:from-dark-bg-tertiary dark:to-dark-bg-secondary">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-warning-500" />
                      <span>Nâng cấp Premium để sử dụng không giới hạn</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAiMenu((v) => !v)}
            className={cn(
              "relative p-4 rounded-full shadow-soft-xl transition-all duration-300",
              "bg-gradient-to-br from-beige-600 to-beige-800 dark:from-beige-400 dark:to-beige-600",
              "hover:shadow-soft-2xl",
              showAiMenu && "ring-4 ring-beige-300 dark:ring-beige-700"
            )}
            aria-label="Open AI Assistant menu"
          >
            <Bot className="w-6 h-6 text-white dark:text-dark-bg-primary" />

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-beige-500/30 animate-ping" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
