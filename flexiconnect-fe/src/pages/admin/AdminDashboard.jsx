import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
const isDark = localStorage.getItem("theme") === "dark";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark");

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Chưa đăng nhập hoặc thiếu token.");
          setLoading(false);
          return;
        }
        const res = await authApis().get(endpoints["admin-dashboard"], {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-300">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const groupByMonth = (data, key) => {
    let months = Array(12).fill(0);
    data
      ?.filter(item => new Date(item.date).getFullYear() === selectedYear)
      .forEach(item => {
        const month = new Date(item.date).getMonth();
        months[month] += item[key] || 0;
      });
    return months;
  };

  const labels = [
    "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
    "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"
  ];

  const userChartData = {
    labels,
    datasets: [
      {
        label: "Ứng viên (Candidate)",
        data: groupByMonth(stats?.userRegistrationStats, "candidate"),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Nhà tuyển dụng (Employer)",
        data: groupByMonth(stats?.userRegistrationStats, "employer"),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const jobChartData = {
    labels,
    datasets: [
      {
        label: "Bài đăng việc làm",
        data: groupByMonth(stats?.jobPostStats, "count"),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { position: "top", labels: { color: isDark ? "#f5efe6" : "#111111", font: { weight: "600" } } },
    title: { display: false }
  },
  scales: { 
    y: { 
      beginAtZero: true, 
      ticks: { color: isDark ? "#f5efe6" : "#111111", font: { weight: "600" } }, 
      grid: { color: isDark ? "#444" : "#e5e7eb" }
    }, 
    x: { 
      ticks: { color: isDark ? "#f5efe6" : "#111111", font: { weight: "600" } },
      grid: { color: isDark ? "#444" : "#e5e7eb" }
    } 
  },
};
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-[#181818] text-gray-800 dark:text-gray-100 space-y-6">
      <h2 className="text-2xl font-bold">📊 Thống kê Admin</h2>

      {/* Filter năm */}
      <div className="flex items-center gap-3">
        <label htmlFor="yearFilter" className="font-medium">Chọn năm:</label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-[#2d2d2d] dark:border-neutral-600 dark:text-gray-200"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
  {statCards.map((card, i) => (
    <div
      key={i}
      className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#232323] rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="text-2xl mb-1">{card.icon}</div>
      <p className="text-lg font-semibold">{stats[card.key]}</p>
      <span className="text-xs text-gray-500 dark:text-gray-300">{card.title}</span>
    </div>
  ))}
</div>


      {/* Biểu đồ */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#232323] p-4 rounded-xl shadow hover:shadow-md transition">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Người dùng đăng ký</h3>
          <div className="h-72">
            <Line data={userChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#232323] p-4 rounded-xl shadow hover:shadow-md transition">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Bài đăng việc làm</h3>
          <div className="h-72">
            <Line data={jobChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const statCards = [
  { title: "Tổng người dùng", key: "totalUsers", icon: "👥" },
  { title: "Nhà tuyển dụng", key: "totalEmployers", icon: "🏢" },
  { title: "Ứng viên", key: "totalCandidates", icon: "🧑‍💼" },
  { title: "Bài đăng việc làm", key: "totalJobPosts", icon: "📝" },
  { title: "Đang hoạt động", key: "activeJobs", icon: "✅" },
  { title: "Chờ xác minh", key: "pendingEmployerVerifications", icon: "⏳" },
  { title: "Tài khoản bị cấm", key: "bannedUsers", icon: "🚫" },
];

export default AdminDashboard;
