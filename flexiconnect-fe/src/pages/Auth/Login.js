import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import InputField from "../../components/forms/InputField";
import PassField from "../../components/forms/PassField";
import { FaSignInAlt } from "react-icons/fa";

export default function Login() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await Apis.post(endpoints["login"], {
        email: user.email,
        password: user.password,
      });

      cookie.save("token", res.data.token);
      cookie.save("email", res.data.email);
      cookie.save("role", res.data.role);

      setMsg("✅ Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setMsg("❌ Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4">
      <form
        onSubmit={login}
        className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Đăng nhập</h2>

        {msg && (
          <div
            className={`text-sm text-center p-2 rounded-md font-medium ${
              msg.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

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

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition flex justify-center items-center gap-2"
        >
          <FaSignInAlt /> Đăng nhập
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-gray-800 font-semibold hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
      </form>
    </div>
  );
}
