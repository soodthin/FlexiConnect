import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/APIs";
import InputField from "../../components/forms/InputField";
import PassField from "../../components/forms/PassField";
import PassStrengthBar from "../../components/forms/PassStrengthBar";

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
        className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md space-y-3"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Đăng ký Ứng Viên</h2>

        {msg && (
          <div className={`text-sm text-center p-2 rounded-md font-medium ${msg.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
            }`}>
            {msg}
          </div>
        )}

        <InputField
          label="Họ và tên"
          value={user.fullName || ""}
          onChange={(e) => setState(e.target.value, "fullName")}
          required
        />

        <InputField
          label="Email"
          type="email"
          value={user.email || ""}
          onChange={(e) => setState(e.target.value, "email")}
          required
        />

        <PassField
          label="Mật khẩu"
          value={user.password || ""}
          onChange={(e) => setState(e.target.value, "password")}
          required
        />

        <PassStrengthBar strength={strength} />

        <PassField
          label="Xác nhận mật khẩu"
          value={user.confirmPassword || ""}
          onChange={(e) => setState(e.target.value, "confirmPassword")}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition"
        >
          Đăng ký
        </button>
        <div className="text-center text-gray-600 text-sm">
          <button
            onClick={() => navigate("/employer-register")}
            className="text-sm text-gray-600 hover:text-black hover:underline transition"
          >
            <span className="font-semibold">Bạn là nhà tuyển dụng?</span>
          </button>
        </div>
      </form>

    </div>
  );
}
