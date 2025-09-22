import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900">
      <h1 className="text-4xl font-bold text-red-800 dark:text-red-200 mb-4">
        ❌ Thanh toán thất bại
      </h1>
      <p className="text-lg text-red-700 dark:text-red-300 mb-6">
        Rất tiếc, quá trình thanh toán không thành công. Vui lòng thử lại.
      </p>
      <button
        onClick={() => navigate("/candidate-upgrade")}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Thử lại
      </button>
    </div>
  );
}
