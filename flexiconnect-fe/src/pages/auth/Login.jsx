import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { toast } from "sonner";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { MyDispatcherContext } from "@contexts/MyContexts";
import { cn } from "@/utils/cn";
import { KeyRound, User, Building2, ShieldCheck } from "lucide-react";

// UI components
const Card = ({ children, className = "" }) => (
  <div
    className={cn(
      "card-elevated shadow-soft-xl p-8",
      className
    )}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={cn(
      "btn btn-primary w-full",
      className
    )}
  >
    {children}
  </button>
);

const Input = ({ type = "text", value, onChange, placeholder, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="flex-1 bg-transparent outline-none text-sm text-softblack dark:text-dark-text-primary placeholder:text-neutral-400 dark:placeholder:text-dark-text-tertiary"
    {...props}
  />
);

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-neutral-700 dark:text-dark-text-secondary mb-1.5">
    {children}
  </label>
);

const InputWrapper = ({ children }) => (
  <div className={cn(
    "flex items-center gap-2 rounded-soft border-2 px-3 h-11 transition-all",
    "border-neutral-200 dark:border-dark-border-subtle",
    "bg-white dark:bg-dark-bg-tertiary",
    "hover:border-beige-400 dark:hover:border-beige-600",
    "focus-within:ring-2 focus-within:ring-beige-500 dark:focus-within:ring-beige-400",
    "focus-within:border-transparent"
  )}>
    {children}
  </div>
);

// Fake job data
const jobs = [
  { title: "Frontend Developer", company: "VNG", salary: "20–30 triệu VND" },
  { title: "Khoa học dữ liệu", company: "Fintech", salary: "25–35 triệu VND" },
  { title: "UI/UX Designer", company: "Creatify", salary: "18–25 triệu VND" },
  { title: "QA/QC", company: "Dcorp", salary: "15-23 triệu VND" },
  { title: "Quản lý cửa hàng", company: "Highlands Coffee", salary: "10-12 triệu VND" },
];

export default function Login() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatcherContext);

  const setState = (value, field) => setUser({ ...user, [field]: value });

  const performLogin = async (credentials) => {
    const loginEmail = credentials?.email ?? user.email;
    const loginPassword = credentials?.password ?? user.password;

    if (!loginEmail || !loginPassword) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const res = await Apis.post(endpoints["login"], {
        email: loginEmail,
        password: loginPassword,
      });
      const { token, role } = res.data;
      const currentUserRes = await Apis.get(endpoints["current-user"], {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = { ...currentUserRes.data, token, role };
      dispatch({ type: "login", payload: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (role === "CANDIDATE") navigate("/candidate-dashboard");
        else if (role === "EMPLOYER") navigate("/employer-dashboard");
        else if (role === "ADMIN") navigate("/admin-dashboard");
        else navigate("/");
      }, 800);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) toast.error(err.response.data);
        else if (err.response.status === 403) toast.error("Sai email hoặc mật khẩu!");
        else toast.error(err.response.data || "Có lỗi xảy ra, vui lòng thử lại sau!");
      } else {
        toast.error("Không thể kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (e) => {
    e.preventDefault();
    performLogin({ email: user.email, password: user.password });
  };

  const handleDemoLogin = (email, password) => {
    setUser({ email, password });
    performLogin({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-beige-50 to-beige-100 dark:from-neutral-900 dark:to-dark-bg-primary">
      {/* Left panel with AI features + auto-scroll jobs */}
      <div className={cn(
        "hidden md:flex flex-[0.45] flex-col justify-center items-center p-10 relative overflow-hidden rounded-r-3xl",
        "bg-gradient-to-br from-beige-100 via-beige-200 to-beige-50",
        "dark:from-neutral-850 dark:via-dark-bg-tertiary dark:to-dark-bg-primary"
      )}>
        <div className="relative z-10 w-full max-w-sm space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-softblack dark:text-dark-text-primary">
              Khám phá cơ hội mới
            </h2>
          </div>

          {/* AI Features */}
          <div className="grid gap-3">
            {/* Feature 1 */}
            <div className={cn(
              "relative p-5 rounded-card",
              "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10",
              "border border-blue-400/20 dark:border-purple-400/20",
              "shadow-soft-md backdrop-blur-md",
              "group hover:shadow-soft-lg transition-all transform hover:-translate-y-1"
            )}>
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-soft">
                BASIC
              </div>

              <h3 className="text-base font-semibold text-softblack dark:text-dark-text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                Gợi ý viết hồ sơ với AI
              </h3>
              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-2 group-hover:text-neutral-800 dark:group-hover:text-dark-text-primary transition-colors">
                AI giúp tối ưu CV, làm nổi bật kỹ năng và kinh nghiệm quan trọng để chinh phục nhà tuyển dụng.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={cn(
              "relative p-5 rounded-card",
              "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10",
              "border border-purple-400/20 dark:border-pink-400/20",
              "shadow-soft-md backdrop-blur-md",
              "group hover:shadow-soft-lg transition-all transform hover:-translate-y-1"
            )}>
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-soft">
                PREMIUM
              </div>

              <h3 className="text-base font-semibold text-softblack dark:text-dark-text-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                Luyện tập phỏng vấn ảo với AI
              </h3>
              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-2 group-hover:text-neutral-800 dark:group-hover:text-dark-text-primary transition-colors">
                Trải nghiệm phỏng vấn mô phỏng với AI, luyện tập câu trả lời và tăng sự tự tin.
              </p>
            </div>
          </div>




          {/* Job list auto-scroll */}
          <div>
            <h3 className="text-sm font-semibold text-softblack dark:text-dark-text-primary mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Việc làm mới nhất
            </h3>

            <div className="h-56 overflow-hidden relative">
              <div className="animate-scroll space-y-3">
                {[...jobs, ...jobs].map((job, i) => (
                  <div
                    key={`job-${job.id || job.title}-${i}`}
                    className={cn(
                      "p-4 rounded-card",
                      "bg-gradient-to-r from-white/70 to-beige-50/60",
                      "dark:from-dark-bg-tertiary/80 dark:to-dark-bg-secondary/70",
                      "border border-neutral-200/40 dark:border-dark-border-subtle/40",
                      "shadow-soft backdrop-blur-md",
                      "hover:shadow-soft-md hover:scale-[1.02] transition-all"
                    )}
                  >
                    <h4 className="font-medium text-softblack dark:text-dark-text-primary text-sm truncate">
                      {job.title}
                    </h4>
                    <p className="text-neutral-600 dark:text-dark-text-secondary text-xs mt-1 truncate">
                      {job.company} • {job.salary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>



      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-md relative">
          <Card>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-softblack dark:text-dark-text-primary">
                FlexiConnect AI
              </h1>
              <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">
                Đăng nhập để tiếp tục
              </p>
            </div>

            {/* Quick Demo Login Box */}
            <div className="mb-6 p-4 rounded-xl border border-neutral-200/80 dark:border-dark-border-subtle bg-neutral-50/80 dark:bg-dark-bg-tertiary/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-neutral-600 dark:text-dark-text-secondary flex items-center gap-1.5">
                  <KeyRound size={14} className="text-neutral-400 dark:text-dark-text-tertiary" />
                  Quick demo access
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-dark-text-tertiary">
                  No sign-up needed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("candidate@demo.com", "123456")}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:border-beige-500 dark:hover:border-beige-400 hover:shadow-sm transition-all text-left group"
                >
                  <User size={14} className="text-neutral-400 group-hover:text-beige-600 dark:group-hover:text-beige-300 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-softblack dark:text-dark-text-primary flex items-center gap-1.5">
                      Candidate
                      <span className="text-[9px] font-medium px-1.5 py-px rounded-full bg-beige-100 text-beige-700 dark:bg-beige-900/40 dark:text-beige-300 shrink-0">
                        Recommended
                      </span>
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-dark-text-tertiary block truncate">
                      Mock Interview, CV AI
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("employer@demo.com", "123456")}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/80 hover:border-beige-500 dark:hover:border-beige-400 hover:shadow-sm transition-all text-left group"
                >
                  <Building2 size={14} className="text-neutral-400 group-hover:text-beige-600 dark:group-hover:text-beige-300 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-softblack dark:text-dark-text-primary block">
                      Employer
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-dark-text-tertiary block truncate">
                      Post jobs, review CVs
                    </span>
                  </div>
                </button>
              </div>

              <div className="mt-2.5 text-center">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin("admin@example.com", "Admin123")}
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-400 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  <ShieldCheck size={12} />
                  Or sign in as Admin →
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
              <span className="flex-shrink mx-3 text-[11px] text-neutral-400 dark:text-dark-text-tertiary uppercase tracking-wider">
                Or enter credentials
              </span>
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <InputWrapper>
                <Input
                  type="email"
                  placeholder="Nhập email..."
                  value={user.email || ""}
                  onChange={(e) => setState(e.target.value, "email")}
                  required
                />
              </InputWrapper>
            </div>

            {/* Password */}
            <div className="space-y-1 mt-4">
              <Label>Mật khẩu</Label>
              <PasswordToggleField.Root>
                <InputWrapper>
                  <PasswordToggleField.Input
                    className="flex-1 bg-transparent outline-none text-sm text-softblack dark:text-dark-text-primary placeholder:text-neutral-400 dark:placeholder:text-dark-text-tertiary"
                    placeholder="Nhập mật khẩu..."
                    value={user.password || ""}
                    onChange={(e) => setState(e.target.value, "password")}
                    required
                  />
                  <PasswordToggleField.Toggle className="outline-none text-neutral-500 dark:text-dark-text-tertiary">
                    <PasswordToggleField.Icon
                      visible={<EyeOpenIcon />}
                      hidden={<EyeClosedIcon />}
                    />
                  </PasswordToggleField.Toggle>
                </InputWrapper>
              </PasswordToggleField.Root>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </div>

            {/* Register link */}
            <p className="text-sm text-center text-neutral-600 dark:text-dark-text-secondary mt-4">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-beige-700 dark:text-beige-400 font-semibold hover:text-beige-900 dark:hover:text-beige-300 hover:underline underline-offset-2 transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>


          </Card>
        </form>
      </div>

      {/* Scroll animation CSS */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll {
          display: flex;
          flex-direction: column;
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
