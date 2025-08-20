import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { FaUserPlus } from "react-icons/fa";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export default function Register() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const [strength, setStrength] = useState({});
  const navigate = useNavigate();

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
    if (field === "password") setStrength(evaluatePasswordStrength(value));
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
      setMsg("❌ Đăng ký thất bại.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-50 dark:bg-[#181818]">
      {/* Left illustration + AI info */}
      <div className="hidden md:flex flex-[0.45] relative items-center justify-center overflow-hidden bg-beige-100 dark:bg-[#1e1e1e] p-8">
        <img
          src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=708&auto=format&fit=crop"
          alt="Job search illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-left space-y-6 max-w-sm">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-50">
            Bắt đầu hành trình sự nghiệp!
          </h2>
          <p className="text-gray-700 dark:text-gray-200">
            Tạo tài khoản ứng viên và tìm việc mơ ước nhanh chóng với <strong>FlexiConnect AI</strong>.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={register}
          className="relative bg-white dark:bg-[#232323] shadow-2xl border border-gray-200 dark:border-neutral-700 rounded-3xl p-8 w-full max-w-md space-y-4 z-20"
        >
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-1 rounded-full shadow-md text-sm font-medium">
            FlexiConnect AI
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
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

          {["fullName", "email", "password", "confirmPassword"].map((field) => (
            <div className="space-y-1" key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                {field === "fullName"
                  ? "Họ và tên"
                  : field === "confirmPassword"
                  ? "Xác nhận mật khẩu"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <PasswordToggleField.Root>
                <div className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 h-10 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition">
                  <PasswordToggleField.Input
                    type={field.includes("password") ? "password" : "text"}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    placeholder={`Nhập ${
                      field === "fullName"
                        ? "họ và tên"
                        : field === "confirmPassword"
                        ? "xác nhận mật khẩu"
                        : field
                    }...`}
                    value={user[field] || ""}
                    onChange={(e) => setState(e.target.value, field)}
                    required
                  />
                  {field.includes("password") && (
                    <PasswordToggleField.Toggle className="outline-none flex items-center justify-center w-5 h-5 text-gray-500 dark:text-gray-300">
                      <PasswordToggleField.Icon
                        visible={<EyeOpenIcon />}
                        hidden={<EyeClosedIcon />}
                      />
                    </PasswordToggleField.Toggle>
                  )}
                </div>

                {/* Password strength bar */}
                {field === "password" && user.password && (
                  <>
                    <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-600 mt-1">
                      <div
                        className={`h-2 rounded transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent || 0}%` }}
                      ></div>
                    </div>
                    {strength.label && (
                      <div
                        className={`text-xs mt-1 font-medium ${strength.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        Độ mạnh mật khẩu: {strength.label}
                      </div>
                    )}
                  </>
                )}
              </PasswordToggleField.Root>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Đăng ký
          </button>

          <div className="text-center text-gray-600 dark:text-gray-300 text-sm">
            <button
              type="button"
              onClick={() => navigate("/employer-register")}
              className="text-sm hover:text-black dark:hover:text-white hover:underline transition mt-2"
            >
              <span className="font-semibold">Bạn là nhà tuyển dụng?</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
