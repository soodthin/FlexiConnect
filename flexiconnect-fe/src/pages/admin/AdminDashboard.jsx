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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  // Cập nhật dark mode reactive
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await authApis().get(endpoints["admin-dashboard"]);
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
        borderColor: isDark ? "#4ade80" : "#22c55e",
        backgroundColor: isDark ? "rgba(74,222,128,0.3)" : "rgba(34,197,94,0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Nhà tuyển dụng (Employer)",
        data: groupByMonth(stats?.userRegistrationStats, "employer"),
        borderColor: isDark ? "#f87171" : "#ef4444",
        backgroundColor: isDark ? "rgba(248,113,113,0.3)" : "rgba(239,68,68,0.2)",
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
        borderColor: isDark ? "#60a5fa" : "#3b82f6",
        backgroundColor: isDark ? "rgba(96,165,250,0.3)" : "rgba(59,130,246,0.2)",
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
    <div className={`p-6 min-h-screen ${isDark ? 'bg-[#181818] text-gray-100' : 'bg-gray-50 text-gray-800'} space-y-6`}>
      <h2 className="text-2xl font-bold">📊 Thống kê Admin</h2>

      {/* Filter năm */}
      <div className="flex items-center gap-3">
        <label htmlFor="yearFilter" className="font-medium">Chọn năm:</label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className={`p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 ${isDark ? 'dark:bg-[#2d2d2d] dark:border-neutral-600 dark:text-gray-200' : ''}`}
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
            className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${isDark ? 'bg-[#232323]' : 'bg-white'}`}
          >
            <div className="text-2xl mb-1">{card.icon}</div>
            <p className="text-lg font-semibold">{stats[card.key]}</p>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{card.title}</span>
          </div>
        ))}
      </div>

      {/* Biểu đồ */}
      <div className="space-y-6">
        <div className={`${isDark ? 'bg-[#232323]' : 'bg-white'} p-4 rounded-xl shadow hover:shadow-md transition`}>
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Người dùng đăng ký</h3>
          <div className="h-72">
            <Line data={userChartData} options={chartOptions} />
          </div>
        </div>

        <div className={`${isDark ? 'bg-[#232323]' : 'bg-white'} p-4 rounded-xl shadow hover:shadow-md transition`}>
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Bài đăng việc làm</h3>
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
  { title: "Tài khoản bị xoá", key: "deletedUsers", icon: "🗑️" }
];

export default AdminDashboard;
