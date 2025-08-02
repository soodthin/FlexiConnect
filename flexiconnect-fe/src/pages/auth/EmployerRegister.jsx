import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { FaUserPlus } from "react-icons/fa";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export default function EmployerRegister() {
  const [employer, setEmployer] = useState({});
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState(null);
  const [strength, setStrength] = useState({});
  const navigate = useNavigate();

  const setState = (value, field) => {
    setEmployer({ ...employer, [field]: value });
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.slice(0, 5));
  };

  const register = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword, companyName, taxId } = employer;

    if (!fullName || !email || !password || !confirmPassword || !companyName || !taxId) {
      setMsg("❌ Vui lòng nhập đầy đủ các trường.");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("❌ Mật khẩu KHÔNG khớp!");
      return;
    }

    if (strength.label !== "Khá" && strength.label !== "Mạnh") {
      setMsg("❌ Mật khẩu phải đủ mạnh để đăng ký.");
      return;
    }

    if (images.length < 3) {
      setMsg("❌ Vui lòng chọn ít nhất 3 ảnh về môi trường làm việc.");
      return;
    }

    try {
      const formData = new FormData();

      const employerObj = {
        companyName,
        taxId,
        companyIntro: "",
        user: {
          fullName,
          email,
          password,
        },
      };

      formData.append("employer", new Blob([JSON.stringify(employerObj)], { type: "application/json" }));

      images.forEach((img) => formData.append("images", img));

      await Apis.post(endpoints["register-employer"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("✅ Đăng ký thành công! Chờ quản trị viên xét duyệt.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg("❌ Đăng ký thất bại. Có thể email đã tồn tại hoặc lỗi máy chủ.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4">
      <form
        onSubmit={register}
        className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Đăng ký Nhà Tuyển Dụng
        </h2>

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

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Họ và tên người đại diện</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập họ và tên..."
              value={employer.fullName || ""}
              onChange={(e) => setState(e.target.value, "fullName")}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email doanh nghiệp</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="email"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập email doanh nghiệp..."
              value={employer.email || ""}
              onChange={(e) => setState(e.target.value, "email")}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Tên công ty</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập tên công ty..."
              value={employer.companyName || ""}
              onChange={(e) => setState(e.target.value, "companyName")}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Mã số thuế (MST)</label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 h-10 hover:border-black focus-within:ring-2 focus-within:ring-black">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              placeholder="Nhập mã số thuế..."
              value={employer.taxId || ""}
              onChange={(e) => setState(e.target.value, "taxId")}
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
                value={employer.password || ""}
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
          {employer.password && (
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
                value={employer.confirmPassword || ""}
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

        <div className="space-y-1">
  <label className="block font-medium text-sm text-gray-700 mb-1">
    Ảnh môi trường làm việc <span className="text-gray-400">(ít nhất 3, tối đa 5)</span>
  </label>
  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:border-black transition p-4">
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      id="workplace-images"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      aria-label="Chọn ảnh môi trường làm việc"
    />
    <div className="flex flex-col items-center pointer-events-none">
      <svg
        className="w-8 h-8 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-9 0h8m-8 0v2a1 1 0 001 1h6a1 1 0 001-1v-2"
        />
      </svg>
      <span className="text-sm text-gray-500 mb-1">
        Kéo thả hoặc <span className="text-blue-600 underline">chọn file</span>
      </span>
      <span className="text-xs text-gray-400">Hỗ trợ ảnh JPG, PNG. Tối đa 5 ảnh.</span>
    </div>
    {images.length > 0 && (
      <div className="absolute left-4 bottom-4 flex items-center gap-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded shadow">
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 8a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Đã chọn {images.length} ảnh
      </div>
    )}
  </div>
</div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <FaUserPlus /> Đăng ký
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-gray-800 font-semibold hover:underline"
          >
            Đăng nhập
          </a>
        </p>
        <p className="text-sm text-center text-gray-600">
          Bạn là ứng viên?{" "}
          <a
            href="/register"
            className="text-gray-800 font-semibold hover:underline"
          >
            Đăng ký ứng viên
          </a>
        </p>
      </form>
    </div>
  );
}