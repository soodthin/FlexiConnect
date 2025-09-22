import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 dark:bg-green-900">
      <h1 className="text-4xl font-bold text-green-800 dark:text-green-200 mb-4">
        🎉 Thanh toán thành công!
      </h1>
      <p className="text-lg text-green-700 dark:text-green-300 mb-6">
        Cảm ơn bạn đã nâng cấp tài khoản. Bạn có thể bắt đầu sử dụng tính năng AI ngay bây giờ.
      </p>
      <button
        onClick={() => navigate("/candidate-profile ")}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Quay lại hồ sơ cá nhân
      </button>
    </div>
  );
}
