import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import { authApis, endpoints } from "@configs/APIs";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await authApis().get(endpoints["admin-users-management"], {
        params: { role, search, page, size },
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, search, page, size]);

  const updateStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      await authApis().put(
        `${endpoints["admin-users-management"]}/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to update user status:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      const token = localStorage.getItem("token");
      await authApis().delete(
        `${endpoints["admin-users-management"]}/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        👥 Quản lý người dùng
      </Typography>

      {/* Bộ lọc */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="CANDIDATE">Ứng viên</MenuItem>
          <MenuItem value="EMPLOYER">Nhà tuyển dụng</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="🔍 Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
          size="small"
        >
          <MenuItem value={5}>5 / trang</MenuItem>
          <MenuItem value={10}>10 / trang</MenuItem>
          <MenuItem value={20}>20 / trang</MenuItem>
          <MenuItem value={50}>50 / trang</MenuItem>
        </Select>
      </Stack>

      {/* Bảng user */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Họ tên</b></TableCell>
              <TableCell><b>Roles</b></TableCell>
              <TableCell><b>Trạng thái</b></TableCell>
              <TableCell><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.roles?.join(", ")}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.status}
                      color={
                        u.status === "ACTIVE"
                          ? "success"
                          : u.status === "BANNED"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => updateStatus(u.id, "ACTIVE")}
                      >
                        Kích hoạt
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateStatus(u.id, "BANNED")}
                      >
                        Khóa
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => deleteUser(u.id)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          ◀ Trang trước
        </Button>
        <Typography>
          Trang {page + 1} / {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
        >
          Trang sau ▶
        </Button>
      </Stack>
    </Box>
  );
};

export default UserManagement;
