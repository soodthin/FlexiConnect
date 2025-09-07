import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { FaUserPlus } from "react-icons/fa";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

// Input field
function InputField({ label, type = "text", value, onChange, placeholder, error }) {
  const inputClass =
    "flex-1 bg-gray-100 dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none text-sm";
  const wrapperClass =
    "flex items-center gap-2 rounded-md border px-3 h-10 transition " +
    (error
      ? "border-red-500 focus-within:ring-2 focus-within:ring-red-400"
      : "border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-[#2d2d2d] hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400");

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div className={wrapperClass}>
        <input
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Password field
function PasswordField({ label, value, onChange, placeholder, error }) {
  const inputClass =
    "flex-1 bg-gray-100 dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none text-sm";
  const wrapperClass =
    "flex items-center gap-2 rounded-md border px-3 h-10 transition " +
    (error
      ? "border-red-500 focus-within:ring-2 focus-within:ring-red-400"
      : "border-gray-300 dark:border-neutral-600 bg-gray-100 dark:bg-[#2d2d2d] hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400");

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <PasswordToggleField.Root>
        <div className={wrapperClass}>
          <PasswordToggleField.Input
            type="password"
            className={inputClass}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
          />
          <PasswordToggleField.Toggle className="outline-none flex items-center justify-center w-5 h-5 text-gray-500">
            <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Alert message
function Alert({ msg }) {
  if (!msg) return null;
  return (
    <div
      className={`text-sm text-center p-2 rounded-md font-medium ${msg.includes("✅")
        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
        }`}
    >
      {msg}
    </div>
  );
}

// File upload with preview
function FileUpload({ images, onChange, onRemove }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Ảnh môi trường làm việc <span className="text-gray-400">(3-5 ảnh)</span>
      </label>
      <div className="relative flex flex-col items-center justify-center border border-gray-300 dark:border-neutral-600 rounded-md bg-gray-100 dark:bg-[#2d2d2d] hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition p-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onChange}
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
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="w-full h-24 object-cover rounded-md shadow"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Button
function ActionButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}

/* ---------------------------------- */
/* 🔹 Feature Component               */
/* ---------------------------------- */

export default function EmployerRegister() {
  const [employer, setEmployer] = useState({});
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState(null);
  const [step, setStep] = useState(1);
  const [strength, setStrength] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const setState = (value, field) => {
    setEmployer({ ...employer, [field]: value });
    if (field === "password") setStrength(evaluatePasswordStrength(value));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let newErrors = { ...errors };

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      newErrors.email = emailRegex.test(value) ? null : "Email không hợp lệ.";
    }

    if (field === "password") {
      newErrors.password = value.length < 8 ? "Mật khẩu phải ít nhất 8 ký tự." : null;
    }

    if (field === "confirmPassword") {
      newErrors.confirmPassword = value !== employer.password ? "Mật khẩu không khớp." : null;
    }

    setErrors(newErrors);
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

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const nextStep = (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, companyName, taxCode } = employer;
    if (!fullName || !email || !password || !confirmPassword || !companyName || !taxCode) {
      setMsg("❌ Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (errors.email || errors.password || errors.confirmPassword) {
      setMsg("❌ Vui lòng sửa lỗi trước khi tiếp tục.");
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
      const { fullName, email, password, companyName, taxCode } = employer;
      const employerObj = {
        companyName,
        taxCode,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 dark:bg-[#181818] p-4">
      <form className="bg-white dark:bg-[#232323] shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md space-y-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
          >
            1
          </div>
          <div className="h-0.5 w-12 bg-gray-400"></div>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
              }`}
          >
            2
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
          Đăng ký Nhà Tuyển Dụng
        </h2>

        <Alert msg={msg} />

        {/* Animate step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <InputField
                label="Họ và tên"
                type="text"
                value={employer.fullName || ""}
                onChange={(e) => setState(e.target.value, "fullName")}
                placeholder="Nhập họ và tên..."
              />
              <InputField
                label="Email"
                type="email"
                value={employer.email || ""}
                onChange={(e) => setState(e.target.value, "email")}
                placeholder="Nhập email..."
                error={errors.email}
              />
              <InputField
                label="Tên công ty"
                type="text"
                value={employer.companyName || ""}
                onChange={(e) => setState(e.target.value, "companyName")}
                placeholder="Nhập tên công ty..."
              />
              <InputField
                label="Mã số thuế"
                type="text"
                value={employer.taxCode || ""}
                onChange={(e) => setState(e.target.value, "taxCode")}
                placeholder="Nhập mã số thuế..."
              />

              <PasswordField
                label="Mật khẩu"
                value={employer.password || ""}
                onChange={(e) => setState(e.target.value, "password")}
                placeholder="Nhập mật khẩu..."
                error={errors.password}
              />
              {employer.password && (
                <>
                  <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-600 mt-1">
                    <div
                      className={`h-2 rounded ${strength.color}`}
                      style={{ width: `${strength.percent || 0}%` }}
                    />
                  </div>
                  {strength.label && (
                    <div
                      className={`text-xs mt-1 font-medium ${strength.color.replace("bg-", "text-")}`}
                    >
                      Độ mạnh mật khẩu: {strength.label}
                    </div>
                  )}
                </>
              )}

              <PasswordField
                label="Xác nhận mật khẩu"
                value={employer.confirmPassword || ""}
                onChange={(e) => setState(e.target.value, "confirmPassword")}
                placeholder="Nhập lại mật khẩu..."
                error={errors.confirmPassword}
              />

              <ActionButton onClick={nextStep}>
                <FaUserPlus /> Tiếp theo
              </ActionButton>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Quay lại đăng nhập
                </Link>
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <FileUpload images={images} onChange={handleImageChange} onRemove={handleRemoveImage} />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 
             py-2 px-6 rounded-xl font-semibold shadow hover:opacity-90 transition 
             flex items-center justify-center"
                >
                  <ArrowLeftIcon className="w-5 h-5 ml-1" />
                </button>



                <ActionButton onClick={register} className="flex-[2] w-full">
                  <FaUserPlus /> Hoàn tất đăng ký
                </ActionButton>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}