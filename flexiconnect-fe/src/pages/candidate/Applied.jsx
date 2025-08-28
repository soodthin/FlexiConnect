import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";
import * as Separator from "@radix-ui/react-separator";
import * as Avatar from "@radix-ui/react-avatar";

const Applied = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await authApis().get(endpoints["candidate-applied"], {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Không thể tải danh sách ứng tuyển!");
      }
    };

    loadApplications();
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-900";
      case "APPROVED":
        return "bg-green-200 text-green-900";
      case "REJECTED":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-[#181818]">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Hồ sơ đã ứng tuyển
      </h2>

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-xl shadow-md border bg-white dark:bg-[#242424] hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden border shadow">
                    <Avatar.Image
                      src={app.companyLogo || ""}
                      alt={app.companyName}
                      className="w-full h-full object-cover"
                    />
                    <Avatar.Fallback className="flex items-center justify-center w-full h-full bg-gray-300 dark:bg-gray-600 text-sm text-gray-700 dark:text-gray-200">
                      🏢
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      {app.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {app.companyName}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-1 text-xs font-semibold rounded-full ${statusStyle(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>

              <Separator.Root className="bg-gray-200 dark:bg-gray-700 h-px w-full mb-4" />

              {/* Body */}
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>📍 <span className="font-medium">{app.companyAddress || "—"}</span></p>
                <p>⏰ Ứng tuyển lúc: {new Date(app.appliedAt).toLocaleString("vi-VN")}</p>
                {app.rejectionReason && (
                  <p className="text-red-500 font-medium">
                    ❌ Lý do từ chối: {app.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Chưa có hồ sơ nào</p>
      )}
    </div>
  );
};

export default Applied;
