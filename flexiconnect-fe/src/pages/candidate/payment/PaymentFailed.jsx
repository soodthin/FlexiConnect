import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-dark-bg-primary">
      <div className="text-center p-8 rounded-2xl bg-white dark:bg-dark-bg-secondary shadow-xl border border-red-200 dark:border-red-800 max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-5xl">❌</span>
        </div>
        <h1 className="text-3xl font-bold text-red-800 dark:text-red-300 mb-4">
          Thanh toán thất bại
        </h1>
        <p className="text-base text-red-700 dark:text-red-400 mb-6">
          Rất tiếc, quá trình thanh toán không thành công. Vui lòng thử lại.
        </p>
        <button
          onClick={() => navigate("/candidate-upgrade")}
          className="w-full px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition font-semibold shadow-md"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
