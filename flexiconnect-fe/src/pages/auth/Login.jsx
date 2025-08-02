import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import cookie from "react-cookies";
import { FaSignInAlt } from "react-icons/fa";

import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { MyDispatcherContext } from "../../contexts/MyContexts";

export default function Login() {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatcherContext);

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    setMsg(null);

    try {
      // Đăng nhập lấy token
      const res = await Apis.post(endpoints["login"], {
        email: user.email,
        password: user.password,
      });
      console.log("Login response:", res.data);

      const { token, role } = res.data;

      cookie.save("token", token);
      localStorage.setItem("token", token);


      const userInfoRes = await Apis.get(endpoints["current-user"], {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = userInfoRes.data;


      dispatch({ type: "login", payload: userInfo });

      setMsg("✅ Đăng nhập thành công!");

      setTimeout(() => {
        if (role === "CANDIDATE") {
          navigate("/candidate-dashboard");
        } else if (role === "EMPLOYER") {
          navigate("/employer-dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

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
            className={`text-sm text-center p-2 rounded-md font-medium ${msg.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
              }`}
          >
            {msg}
          </div>
        )}

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
        </div>

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