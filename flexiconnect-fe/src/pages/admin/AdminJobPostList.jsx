import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Descriptions,
  message,
} from "antd";
import dayjs from "dayjs";
import { authApis, endpoints } from "@configs/APIs";

const { Search } = Input;
const { Option } = Select;

const AdminJobPostList = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch job posts
  const fetchJobPosts = async ({
    page: overridePage = page,
    size: overrideSize = pageSize,
    status: overrideStatus = status,
    search: overrideSearch = search,
  } = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {
        page: overridePage,
        size: overrideSize,
      };

      if (overrideStatus) params.status = overrideStatus;
      if (overrideSearch && overrideSearch.trim() !== "")
        params.search = overrideSearch.trim();

      const res = await authApis().get(endpoints["admin-jobposts"], {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobPosts(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("❌ Lỗi khi tải tin tuyển dụng:", err);
      message.error("Không thể tải danh sách tin tuyển dụng!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tự động fetch khi thay đổi filter / phân trang
  useEffect(() => {
    fetchJobPosts();
  }, [page, pageSize, status, search]);

  // ✅ Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await authApis().put(
        `${endpoints["admin-jobposts"]}/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(`Cập nhật trạng thái thành công: ${newStatus}`);
      setIsModalOpen(false);
      fetchJobPosts();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      message.error("Không thể cập nhật trạng thái!");
    }
  };

  const columns = [
    { title: "Mã tin", dataIndex: "id", key: "id", width: 80 },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        if (status === "OPEN") color = "green";
        if (status === "CLOSED") color = "red";
        if (status === "HIDDEN") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Công ty", dataIndex: "companyName", key: "companyName" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-",
    },
  ];

  const onRowClick = (record) => {
    setSelectedJob(record);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản trị - Tin tuyển dụng</h2>

      <Space style={{ marginBottom: 16 }}>
        {/* ✅ Tìm kiếm */}
        <Search
          placeholder="Tìm kiếm theo tiêu đề hoặc mô tả"
          allowClear
          enterButton="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => {
            setPage(0);
            setSearch(value);
          }}
          style={{ width: 300 }}
        />

        {/* ✅ Filter theo trạng thái */}
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 180 }}
          value={status}
          onChange={(value) => {
            setPage(0);
            setStatus(value || null);
          }}
        >
          <Option value="OPEN">Đang mở</Option>
          <Option value="CLOSED">Đã đóng</Option>
          <Option value="HIDDEN">Ẩn</Option>
        </Select>

        {/* ✅ Làm mới */}
        <Button
          type="primary"
          onClick={() => {
            setPage(0);
            setStatus(null);
            setSearch("");
            fetchJobPosts({ page: 0, size: pageSize, status: null, search: "" });
          }}
        >
          Làm mới
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={jobPosts}
        loading={loading}
        pagination={{
          current: page + 1,
          pageSize: pageSize,
          total: totalElements,
          showSizeChanger: true,
          onChange: (newPage, newPageSize) => {
            setPage(newPage - 1);
            setPageSize(newPageSize);
          },
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />

      {/* ✅ Modal chi tiết */}
      <Modal
        title={`Chi tiết tin tuyển dụng - ${selectedJob?.title}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedJob && (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã tin">
                {selectedJob.id}
              </Descriptions.Item>
              <Descriptions.Item label="Tiêu đề">
                {selectedJob.title}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedJob.description}
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {selectedJob.location}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedJob.status === "OPEN"
                      ? "green"
                      : selectedJob.status === "CLOSED"
                      ? "red"
                      : "orange"
                  }
                >
                  {selectedJob.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Công ty">
                {selectedJob.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(selectedJob.createdAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: 16 }}>
              <Button
                type="primary"
                onClick={() => updateStatus(selectedJob.id, "OPEN")}
                disabled={selectedJob.status === "OPEN"}
              >
                ✅ Mở
              </Button>
              <Button
                danger
                onClick={() => updateStatus(selectedJob.id, "CLOSED")}
                disabled={selectedJob.status === "CLOSED"}
              >
                🔒 Đóng
              </Button>
              <Button
                onClick={() => updateStatus(selectedJob.id, "HIDDEN")}
                disabled={selectedJob.status === "HIDDEN"}
              >
                👁️‍🗨️ Ẩn
              </Button>
            </Space>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminJobPostList;
