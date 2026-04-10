import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 dark:bg-dark-bg-primary">
      <div className="text-center p-8 rounded-2xl bg-white dark:bg-dark-bg-secondary shadow-xl border border-green-200 dark:border-green-800 max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-5xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">
          Thanh toán thành công!
        </h1>
        <p className="text-base text-green-700 dark:text-green-400 mb-6">
          Cảm ơn bạn đã nâng cấp tài khoản. Bạn có thể bắt đầu sử dụng tính năng AI ngay bây giờ.
        </p>
        <button
          onClick={() => navigate("/candidate-profile")}
          className="w-full px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition font-semibold shadow-md"
        >
          Quay lại hồ sơ cá nhân
        </button>
      </div>
    </div>
  );
}
