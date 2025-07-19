import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/APIs";
import InputField from "../../components/forms/InputField";
import PassField from "../../components/forms/PassField";
import PassStrengthBar from "../../components/forms/PassStrengthBar";

export default function EmployerRegister() {
  const [employer, setEmployer] = useState({});
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState(null);
  const [strength, setStrength] = useState({});
  const navigate = useNavigate();

  const setState = (value, field) => {
    setEmployer({ ...employer, [field]: value });
    if (field === "password") {
      setStrength(evaluatePasswordStrength(value));
    }
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
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg("❌ Đăng ký thất bại. Có thể email đã tồn tại hoặc lỗi máy chủ.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-4">
      <form
        onSubmit={register}
        className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md space-y-3"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Đăng ký Nhà Tuyển Dụng
        </h2>

        {msg && (
          <div
            className={`text-sm text-center p-2 rounded-md font-medium ${msg.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
              }`}
          >
            {msg}
          </div>
        )}

        <InputField
          label="Họ và tên người đại diện"
          value={employer.fullName || ""}
          onChange={(e) => setState(e.target.value, "fullName")}
          required
        />

        <InputField
          label="Email doanh nghiệp"
          type="email"
          value={employer.email || ""}
          onChange={(e) => setState(e.target.value, "email")}
          required
        />

        <InputField
          label="Tên công ty"
          value={employer.companyName || ""}
          onChange={(e) => setState(e.target.value, "companyName")}
          required
        />

        <InputField
          label="Mã số thuế (MST)"
          value={employer.taxId || ""}
          onChange={(e) => setState(e.target.value, "taxId")}
          required
        />

        <PassField
          label="Mật khẩu"
          value={employer.password || ""}
          onChange={(e) => setState(e.target.value, "password")}
          required
        />

        <PassStrengthBar strength={strength} />

        <PassField
          label="Xác nhận mật khẩu"
          value={employer.confirmPassword || ""}
          onChange={(e) => setState(e.target.value, "confirmPassword")}
          required
        />

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            Ảnh môi trường làm việc (ít nhất 3 ảnh)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          />
          {images.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Đã chọn {images.length} ảnh
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
