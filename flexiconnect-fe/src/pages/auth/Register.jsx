import { useState } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/90 dark:bg-dark-bg-secondary/90 shadow-xl border border-neutral-200/50 dark:border-dark-border-primary/50 
                rounded-2xl p-8 w-full max-w-md space-y-5 backdrop-blur-md relative z-20 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`w-full bg-gradient-to-r from-black to-gray-500 text-white py-2.5 rounded-xl font-semibold 
                shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
    {children}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-md border border-neutral-300 dark:border-dark-border-subtle bg-neutral-100 dark:bg-neutral-700 
                px-3 h-10 text-sm text-neutral-800 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-gray-300 
                outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition ${className}`}
    {...props}
  />
);

const PasswordField = ({ value, onChange, placeholder, show, toggle }) => (
  <div
    className="flex items-center gap-2 rounded-md border border-neutral-300 dark:border-dark-border-subtle 
               bg-neutral-100 dark:bg-neutral-700 px-3 h-10 focus-within:ring-2 focus-within:ring-blue-400 transition"
  >
    <input
      type={show ? "text" : "password"}
      autoComplete="new-password"
      className="flex-1 bg-transparent outline-none text-sm text-neutral-800 dark:text-neutral-100"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
    <button
      type="button"
      onClick={toggle}
      className="outline-none flex items-center justify-center w-5 h-5 text-neutral-500 dark:text-neutral-300"
    >
      {show ? <Eye size={16} /> : <EyeOff size={16} />}
    </button>
  </div>
);

const StrengthBar = ({ strength }) => (
  <>
    <div className="w-full h-2 rounded bg-neutral-200 dark:bg-neutral-600 mt-1">
      <div
        className={`h-2 rounded transition-all duration-300 ${strength.color}`}
        style={{ width: `${strength.percent || 0}%` }}
      ></div>
    </div>
    {strength.label && (
      <div
        className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}
      >
        Độ mạnh mật khẩu: {strength.label}
      </div>
    )}
  </>
);

export default function Register() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const [strength, setStrength] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
    if (field === "password")
      setStrength(value ? evaluatePasswordStrength(value) : {});
  };

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { label: "", percent: 0, color: "" };
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Yếu", percent: 25, color: "bg-red-500" };
    if (score === 2) return { label: "Trung bình", percent: 50, color: "bg-yellow-500" };
    if (score === 3) return { label: "Khá", percent: 75, color: "bg-blue-500" };
    return { label: "Mạnh", percent: 100, color: "bg-green-500" };
  };

  const register = async (e) => {
    e.preventDefault();
    if (!user.fullName || !user.email || !user.password || !user.confirmPassword) {
      setMsg("❌ Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (user.password !== user.confirmPassword) {
      setMsg("❌ Mật khẩu KHÔNG khớp!");
      return;
    }
    if (strength.label !== "Khá" && strength.label !== "Mạnh") {
      setMsg("❌ Mật khẩu phải đủ mạnh để đăng ký.");
      return;
    }
    try {
      await Apis.post(endpoints["register"], {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });
      setMsg("✅ Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg("❌ Đăng ký không thành công!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#181818] dark:to-[#101010]">
      {/* Left Panel */}
      <div className="hidden md:flex flex-[0.45] flex-col justify-center items-start px-10 py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#181818] relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-sm">
          <h2 className="text-4xl font-bold text-neutral-800 dark:text-neutral-50 leading-snug">
            Bắt đầu hành trình sự nghiệp!
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-lg">
            Tạo tài khoản và kết nối nhanh chóng với{" "}
            <span className="text-black dark:text-neutral-500 font-semibold">FlexiConnect AI</span>.
          </p>

          {/* AI highlights */}
          <div className="grid gap-3 mt-6">
            <div className="p-3 rounded-lg bg-white/80 dark:bg-dark-bg-tertiary/80 border border-neutral-200/40 dark:border-dark-border-primary/40 backdrop-blur-md shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Gợi ý viết hồ sơ với AI
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Làm nổi bật kỹ năng & kinh nghiệm quan trọng để chinh phục NTD.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/80 dark:bg-dark-bg-tertiary/80 border border-neutral-200/40 dark:border-dark-border-primary/40 backdrop-blur-md shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Luyện tập phỏng vấn ảo
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Trải nghiệm phỏng vấn mô phỏng với AI để tự tin hơn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={register} className="w-full max-w-md">
          <Card>
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-black to-gray-500 text-white px-4 py-1 rounded-full text-xs font-medium shadow">
              FlexiConnect AI
            </div>

            <h2 className="text-3xl font-bold text-center text-neutral-800 dark:text-neutral-100">
              Đăng ký Ứng Viên
            </h2>

            {msg && (
              <div
                className={`text-sm text-center p-2 rounded-md font-medium ${
                  msg.includes("✅")
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
                }`}
              >
                {msg}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <Label>Họ và tên</Label>
              <Input
                type="text"
                placeholder="Nhập họ và tên..."
                value={user.fullName || ""}
                onChange={(e) => setState(e.target.value, "fullName")}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Nhập email..."
                value={user.email || ""}
                onChange={(e) => setState(e.target.value, "email")}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Mật khẩu</Label>
              <PasswordField
                value={user.password}
                onChange={(e) => setState(e.target.value, "password")}
                placeholder="Nhập mật khẩu..."
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
              {user.password && <StrengthBar strength={strength} />}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label>Xác nhận mật khẩu</Label>
              <PasswordField
                value={user.confirmPassword}
                onChange={(e) => setState(e.target.value, "confirmPassword")}
                placeholder="Xác nhận mật khẩu..."
                show={showConfirm}
                toggle={() => setShowConfirm(!showConfirm)}
              />
            </div>

            {/* Submit */}
            <Button type="submit">
              <UserPlus size={16} /> Đăng ký
            </Button>

            <div className="text-center text-neutral-600 dark:text-neutral-300 text-sm mt-2">
              <button
                type="button"
                onClick={() => navigate("/employer-register")}
                className="hover:text-black dark:hover:text-white hover:underline font-semibold transition"
              >
                Bạn là nhà tuyển dụng?
              </button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
