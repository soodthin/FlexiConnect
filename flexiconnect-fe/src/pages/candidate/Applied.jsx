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
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 border border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // 🔹 Hàm parse description
  const parseDescription = (description) => {
    if (!description) return [];

    return description
      .split("\n")
      .map((line) => {
        const [key, value] = line.split(":").map((s) => s.trim());
        if (!key || !value) return null;
        return { key, value };
      })
      .filter(Boolean);
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
              className="p-6 rounded-xl shadow-sm border bg-white dark:bg-[#242424] hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden border shadow">
                    <Avatar.Image
                      src={app.companyLogo || ""}
                      alt={app.companyName}
                      className="w-full h-full object-cover"
                    />
                    <Avatar.Fallback className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {app.companyName?.[0] || "C"}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      {app.jobPostTitle || app.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {app.companyName}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyle(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>

              <Separator.Root className="bg-gray-200 dark:bg-gray-700 h-px w-full mb-4" />

              {/* Body */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <p className="text-gray-500">Địa điểm</p>
                  <p className="font-medium">{app.location || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Loại công việc</p>
                  <p className="font-medium">{app.jobType || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mức lương</p>
                  <p className="font-medium">
                    {app.salaryMin && app.salaryMax
                      ? `${app.salaryMin} - ${app.salaryMax} triệu`
                      : "Thỏa thuận"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Ứng tuyển lúc</p>
                  <p className="font-medium">
                    {new Date(app.appliedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Extra info */}
              <div className="mt-4 space-y-2">
                {app.coverLetter && (
                  <p className="italic text-gray-500">“{app.coverLetter}”</p>
                )}

                
                

                {app.rejectionReason && (
                  <p className="text-red-500 font-medium">
                    Lý do từ chối: {app.rejectionReason}
                  </p>
                )}

                {/* 🔹 Render description đẹp hơn */}
                {app.description && (
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                    {parseDescription(app.description).map(({ key, value }, idx) => (
                      <div key={idx}>
                        <p className="text-gray-500">{key}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
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
