import { useState, useEffect } from "react";
import { authApis, endpoints } from "@configs/APIs";

export default function CandidateUpgrade() {
  const [loading, setLoading] = useState(false);
  const [userPackage, setUserPackage] = useState(null);

  // Lấy gói hiện tại khi component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApis().get(endpoints["candidate-profile"]);
        setUserPackage(res.data.userPackage || null);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  const handleUpgrade = async (packageId, amount) => {
    // Kiểm tra hạn chế nâng cấp
    if (userPackage?.name === "Premium") {
      alert("Bạn đang sử dụng gói Premium, không thể nâng cấp thêm!");
      return;
    }
    if (userPackage?.name === "Basic" && packageId === 1) {
      alert("Bạn đã có gói Basic, chỉ có thể nâng cấp lên Premium.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${endpoints["momo"]}/create?amount=${amount}&packageId=${packageId}`;
      const res = await authApis().post(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payUrl = res.data?.payUrl?.payUrl || res.data?.payUrl; 
      if (payUrl && typeof payUrl === "string") {
        window.location.href = payUrl;
      } else {
        alert("Không thể tạo giao dịch. Thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo giao dịch MoMo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-16 px-4">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-gray-100 text-center">
        Nâng cấp tài khoản AI
      </h2>

      <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
        {/* Card Basic */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition duration-300">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Basic
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Chức năng AI cơ bản dành cho người mới:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              <li>Đánh giá CV tự động bằng AI</li>
              <li>Gợi ý chỉnh sửa CV để tăng cơ hội phỏng vấn</li>
            </ul>
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
              55.000₫
            </div>
          </div>
          <button
            onClick={() => handleUpgrade(1, 55000)}
            disabled={loading || userPackage?.name === "Basic" || userPackage?.name === "Premium"}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            {userPackage?.name === "Basic"
              ? "Đang sử dụng"
              : userPackage?.name === "Premium"
              ? "Không thể nâng cấp"
              : loading
              ? "Đang tạo giao dịch..."
              : "Nâng cấp ngay"}
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Phương thức thanh toán: MoMo
          </p>
        </div>

        {/* Card Premium */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition duration-300">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Premium
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Chức năng AI nâng cao dành cho người tìm việc chuyên nghiệp:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              <li>Tất cả tính năng của Basic</li>
              <li>Mock interview / Phỏng vấn thử với AI</li>
              <li>Hỗ trợ tạo Cover Letter bằng AI</li>
            </ul>
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-4">
              115.000₫
            </div>
          </div>
          <button
            onClick={() => handleUpgrade(2, 115000)}
            disabled={loading || userPackage?.name === "Premium"}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            {userPackage?.name === "Premium"
              ? "Đang sử dụng"
              : loading
              ? "Đang tạo giao dịch..."
              : "Nâng cấp ngay"}
          </button>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Phương thức thanh toán: MoMo
          </p>
        </div>
      </div>
    </div>
  );
}
