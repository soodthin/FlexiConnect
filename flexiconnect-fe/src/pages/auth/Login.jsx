import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import cookie from "react-cookies";
import { toast } from "sonner";

import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { MyDispatcherContext } from "../../contexts/MyContexts";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-[#232323] shadow-2xl border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition flex justify-center items-center gap-2 ${className}`}
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
    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
    {...props}
  />
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </label>
);

const InputWrapper = ({ children }) => (
  <div className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-[#2d2d2d] px-3 h-10 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition">
    {children}
  </div>
);

export default function Login() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatcherContext);

  const setState = (value, field) => setUser({ ...user, [field]: value });

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await Apis.post(endpoints["login"], {
        email: user.email,
        password: user.password,
      });

      const { token, role } = res.data;
      cookie.save("token", token);
      localStorage.setItem("token", token);

      const userInfoRes = await Apis.get(endpoints["current-user"], {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "login", payload: userInfoRes.data });

      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        if (role === "CANDIDATE") navigate("/candidate-dashboard");
        else if (role === "EMPLOYER") navigate("/employer-dashboard");
        else navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-50 dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#181818]">
      {/* Left illustration */}
      <div className="hidden md:flex flex-[0.45] relative bg-beige-100 dark:bg-[#1e1e1e] p-8 flex-col justify-center">
        <img
          src="https://images.unsplash.com/photo-1752520316159-741a8d0bde1d?q=80&w=708&auto=format&fit=crop"
          alt="Job search illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-20 animate-pulse-slow"
        />
        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Chào mừng trở lại!
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Tìm việc mơ ước nhanh chóng và dễ dàng với <strong>FlexiConnect AI</strong>.
          </p>
          <div className="bg-white/80 dark:bg-gray-800/80 p-4 shadow-sm backdrop-blur-sm rounded-md">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Tính năng AI
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1 text-sm">
              <li>Gợi ý CV phù hợp vị trí bạn muốn ứng tuyển</li>
              <li>Chatbot luyện tập phỏng vấn trực tuyến</li>
              <li>Phân tích hồ sơ cải thiện điểm mạnh & kỹ năng</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-beige-50 dark:bg-[#181818]">
        <form
          onSubmit={login}
          className="relative w-full max-w-md space-y-4 z-20"
        >
          {/* Banner */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-1 rounded-full shadow-md text-sm font-medium">
            FlexiConnect AI (Premium)
          </div>

          <Card>
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
              Đăng nhập
            </h2>

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
            <div className="space-y-1 mt-3">
              <Label>Mật khẩu</Label>
              <PasswordToggleField.Root>
                <InputWrapper>
                  <PasswordToggleField.Input
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    placeholder="Nhập mật khẩu..."
                    value={user.password || ""}
                    onChange={(e) => setState(e.target.value, "password")}
                    required
                  />
                  <PasswordToggleField.Toggle className="outline-none flex items-center justify-center w-5 h-5 text-gray-500">
                    <PasswordToggleField.Icon
                      visible={<EyeOpenIcon />}
                      hidden={<EyeClosedIcon />}
                    />
                  </PasswordToggleField.Toggle>
                </InputWrapper>
              </PasswordToggleField.Root>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <Button type="submit">Đăng nhập</Button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-gray-800 dark:text-gray-100 font-semibold hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </Card>
        </form>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.02); }
          }
          .animate-pulse-slow { animation: pulse-slow 6s infinite; }
        `}
      </style>
    </div>
  );
}
