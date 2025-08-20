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
  const [step, setStep] = useState(1); // Bước 1: thông tin, bước 2: upload ảnh
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

  const nextStep = (e) => {
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

    setMsg(null);
    setStep(2);
  };

  const register = async (e) => {
    e.preventDefault();
    if (images.length < 3) {
      setMsg("❌ Vui lòng chọn ít nhất 3 ảnh môi trường làm việc.");
      return;
    }

    try {
      const formData = new FormData();
      const { fullName, email, password, companyName, taxId } = employer;
      const employerObj = {
        companyName,
        taxId,
        companyIntro: "",
        user: { fullName, email, password },
      };
      formData.append("employer", new Blob([JSON.stringify(employerObj)], { type: "application/json" }));
      images.forEach((img) => formData.append("images", img));

      await Apis.post(endpoints["register-employer"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Đăng ký thành công! Chờ quản trị viên xét duyệt.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg("❌ Đăng ký thất bại. Email có thể đã tồn tại hoặc lỗi máy chủ.");
    }
  };

  const inputClass = "flex-1 bg-gray-100 dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none text-sm";

  const wrapperClass = "flex items-center gap-2 rounded-md border border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-[#2d2d2d] px-3 h-10 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-[#181818] p-4">
      <form className="bg-white dark:bg-[#232323] shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Đăng ký Nhà Tuyển Dụng
        </h2>

        {msg && (
          <div className={`text-sm text-center p-2 rounded-md font-medium ${
            msg.includes("✅")
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
          }`}>{msg}</div>
        )}

        {step === 1 && (
          <>
            {[{ label: "Họ và tên", field: "fullName", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Tên công ty", field: "companyName", type: "text" },
              { label: "Mã số thuế", field: "taxId", type: "text" }
            ].map(({ label, field, type }) => (
              <div className="space-y-1" key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
                <div className={wrapperClass}>
                  <input
                    type={type}
                    className={inputClass}
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    value={employer[field] || ""}
                    onChange={(e) => setState(e.target.value, field)}
                    required
                  />
                </div>
              </div>
            ))}

            {["password", "confirmPassword"].map((field) => (
              <div className="space-y-1" key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {field === "password" ? "Mật khẩu" : "Xác nhận mật khẩu"}
                </label>
                <PasswordToggleField.Root>
                  <div className={wrapperClass}>
                    <PasswordToggleField.Input
                      type="password"
                      className={inputClass}
                      placeholder={`Nhập ${field === "password" ? "mật khẩu" : "xác nhận mật khẩu"}...`}
                      value={employer[field] || ""}
                      onChange={(e) => setState(e.target.value, field)}
                      required
                    />
                    <PasswordToggleField.Toggle className="outline-none flex items-center justify-center w-5 h-5 text-gray-500">
                      <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
                    </PasswordToggleField.Toggle>
                  </div>
                </PasswordToggleField.Root>
                {field === "password" && employer.password && (
                  <>
                    <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-600 mt-1">
                      <div className={`h-2 rounded ${strength.color}`} style={{ width: `${strength.percent || 0}%` }} />
                    </div>
                    {strength.label && (
                      <div className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}>
                        Độ mạnh mật khẩu: {strength.label}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <button
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 flex items-center justify-center gap-2"
            >
              <FaUserPlus /> Tiếp theo
            </button>
          </>
        )}

       {step === 2 && (
  <>
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Ảnh môi trường làm việc <span className="text-gray-400">(3-5 ảnh)</span>
      </label>
      <div className="relative flex flex-col items-center justify-center border border-gray-300 dark:border-neutral-600 rounded-md bg-gray-100 dark:bg-[#2d2d2d] hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition p-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
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
          <span className="text-sm text-gray-800 dark:text-gray-100 mb-1">
            Kéo thả hoặc <span className="text-blue-600 underline">chọn file</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Hỗ trợ ảnh JPG, PNG. Tối đa 5 ảnh.
          </span>
        </div>
        {images.length > 0 && (
          <div className="absolute left-4 bottom-4 flex items-center gap-2 text-xs text-gray-800 dark:text-gray-100 bg-white/30 dark:bg-black/30 px-2 py-1 rounded shadow">
            Đã chọn {images.length} ảnh
          </div>
        )}
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button
        type="button"
        onClick={() => setStep(1)}
        className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 py-2 rounded-xl font-semibold shadow hover:opacity-90 transition"
      >
        Quay lại
      </button>

      <button
        onClick={register}
        className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 flex items-center justify-center gap-2"
      >
        <FaUserPlus /> Hoàn tất đăng ký
      </button>
    </div>
  </>
)}



      </form>
    </div>
  );
}
