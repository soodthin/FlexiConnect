import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
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

// Đăng ký Chart.js components cho Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        console.log("📊 API Data:", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        setError("Không thể tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Biểu đồ người dùng (Candidate + Employer)
// Biểu đồ người dùng (Candidate + Employer)
const userChartData = {
  labels: stats?.userRegistrationStats?.map((item) => item.date) || [],
  datasets: [
    {
      label: "Ứng viên (Candidate)",
      data: stats?.userRegistrationStats?.map((item) => item.candidate) || [], // 👈 đổi từ candidates -> candidate
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      tension: 0.3,
      fill: true,
    },
    {
      label: "Nhà tuyển dụng (Employer)",
      data: stats?.userRegistrationStats?.map((item) => item.employer) || [], // 👈 đổi từ employers -> employer
      borderColor: "rgba(255,99,132,1)",
      backgroundColor: "rgba(255,99,132,0.2)",
      tension: 0.3,
      fill: true,
    },
  ],
};


  // Biểu đồ bài đăng việc làm
  const jobChartData = {
    labels: stats?.jobPostStats?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Bài đăng việc làm",
        data: stats?.jobPostStats?.map((item) => item.count) || [],
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 6 } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 Thống kê Admin</h2>

      {/* Card thống kê */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {statCards.map((card, index) => (
          <div key={index} style={{ ...cardStyle, background: card.bg }}>
            <div style={{ fontSize: "22px", marginBottom: "6px" }}>
              {card.icon}
            </div>
            <h4 style={{ margin: "4px 0", fontSize: "15px" }}>{card.title}</h4>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {stats[card.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Biểu đồ Người dùng */}
      <div style={chartCardStyle}>
        <h3>📈 Người dùng đăng ký</h3>
        <div style={{ height: "300px" }}>
          <Line data={userChartData} options={chartOptions} />
        </div>
      </div>

      {/* Biểu đồ Bài đăng việc làm */}
      <div style={chartCardStyle}>
        <h3>📉 Bài đăng việc làm</h3>
        <div style={{ height: "300px" }}>
          <Line data={jobChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

// Config thẻ thống kê
const statCards = [
  { title: "Tổng người dùng", key: "totalUsers", icon: "👥", bg: "linear-gradient(135deg,#e0f7fa,#80deea)" },
  { title: "Nhà tuyển dụng", key: "totalEmployers", icon: "🏢", bg: "linear-gradient(135deg,#f1f8e9,#aed581)" },
  { title: "Ứng viên", key: "totalCandidates", icon: "🧑‍💼", bg: "linear-gradient(135deg,#fce4ec,#f48fb1)" },
  { title: "Bài đăng việc làm", key: "totalJobPosts", icon: "📝", bg: "linear-gradient(135deg,#e8eaf6,#9fa8da)" },
  { title: "Đang hoạt động", key: "activeJobs", icon: "✅", bg: "linear-gradient(135deg,#f3e5f5,#ce93d8)" },
  { title: "Chờ xác minh", key: "pendingEmployerVerifications", icon: "⏳", bg: "linear-gradient(135deg,#fff3e0,#ffb74d)" },
  { title: "Tài khoản bị cấm", key: "bannedUsers", icon: "🚫", bg: "linear-gradient(135deg,#ffebee,#ef9a9a)" },
];

const cardStyle = {
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
  color: "#333",
  transition: "transform 0.2s",
  cursor: "pointer",
};

const chartCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  marginBottom: "25px",
};

export default AdminDashboard;
