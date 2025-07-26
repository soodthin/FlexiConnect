import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/APIs";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4">
      <form
        onSubmit={register}
        className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Đăng ký Ứng Viên</h2>

        {msg && (
          <div className={`text-sm text-center p-2 rounded-md font-medium ${msg.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
            }`}>
            {msg}
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập họ và tên..."
              value={user.fullName || ""}
              onChange={(e) => setState(e.target.value, "fullName")}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="email"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập email..."
              value={user.email || ""}
              onChange={(e) => setState(e.target.value, "email")}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <PasswordToggleField.Root>
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
              <PasswordToggleField.Input
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
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
            </div>
          </PasswordToggleField.Root>
          {/* Password strength bar */}
          {user.password && (
            <div className="w-full h-2 rounded bg-gray-200 mt-1">
              <div
                className={`h-2 rounded transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percent || 0}%` }}
              ></div>
            </div>
          )}
          {strength.label && (
            <div className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}>
              Độ mạnh mật khẩu: {strength.label}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <PasswordToggleField.Root>
            <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
              <PasswordToggleField.Input
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                placeholder="Xác nhận mật khẩu..."
                value={user.confirmPassword || ""}
                onChange={(e) => setState(e.target.value, "confirmPassword")}
                required
              />
              <PasswordToggleField.Toggle className="outline-none flex items-center justify-center w-5 h-5 text-gray-500">
                <PasswordToggleField.Icon
                  visible={<EyeOpenIcon />}
                  hidden={<EyeClosedIcon />}
                />
              </PasswordToggleField.Toggle>
            </div>
          </PasswordToggleField.Root>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <FaUserPlus /> Đăng ký
        </button>
        <div className="text-center text-gray-600 text-sm">
          <button
            type="button"
            onClick={() => navigate("/employer-register")}
            className="text-sm text-gray-600 hover:text-black hover:underline transition mt-2"
          >
            <span className="font-semibold">Bạn là nhà tuyển dụng?</span>
          </button>
        </div>
      </form>
    </div>
  );
}