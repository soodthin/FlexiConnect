import React, { useState } from 'react';
import { Table, Badge, Button, IconButton, Tooltip } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { EyeOpenIcon, DownloadIcon } from '@radix-ui/react-icons';

const ApplicationsList = ({ applications = [], onReviewClick }) => {
  // State để lưu URL xem trước, dùng để hiển thị iframe
  const [previewUrl, setPreviewUrl] = useState(null);

  // GHI CHÚ: Các hàm xử lý URL đã được xoá vì backend đã cung cấp sẵn URL cuối cùng.

  if (!Array.isArray(applications) || applications.length === 0) {
    return <p className="p-6 text-center text-gray-500">Không có đơn ứng tuyển nào.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Danh sách ứng viên</h2>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table.Root variant="surface" size="2">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="text-center">Ứng viên</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center">Công việc</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center">Thời gian</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center">CV</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center">Cover Letter</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center">Trạng thái</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="text-center"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {applications.map((app) => (
              <Table.Row key={app.id}>
                <Table.Cell className="text-center font-medium text-gray-900">
                  {app.candidateName}
                </Table.Cell>
                <Table.Cell className="text-center">{app.jobPostTitle || app.jobTitle}</Table.Cell>
                <Table.Cell className="text-center text-sm text-gray-500">
                  {new Date(app.appliedAt).toLocaleString()}
                </Table.Cell>
                <Table.Cell className="text-center space-x-2">
                  {/* ✅ GHI CHÚ: Kiểm tra sự tồn tại của cả 2 URL */}
                  {app.resumeFile && app.downloadUrl ? (
                    <>
                      <Tooltip content="Xem CV">
                        <IconButton
                          color="blue"
                          variant="soft"
                          // ✅ GHI CHÚ: Dùng trực tiếp `resumeFile` để xem
                          onClick={() => setPreviewUrl(app.resumeFile)}
                        >
                          <EyeOpenIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Tải CV">
                        {/* ✅ GHI CHÚ: Dùng trực tiếp `downloadUrl` để tải */}
                        <a
                          href={app.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <IconButton color="green" variant="soft">
                            <DownloadIcon />
                          </IconButton>
                        </a>
                      </Tooltip>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Không có</span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="max-w-[300px] mx-auto truncate text-gray-700 text-sm">
                    {app.coverLetter || <em>Không có</em>}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <Badge
                    color={
                      app.status === 'APPROVED' ? 'green' : app.status === 'REJECTED' ? 'red' : 'gray'
                    }
                    variant="solid"
                  >
                    {app.status === 'APPROVED' ? 'Chấp nhận' : app.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-center">
                  <Button onClick={() => onReviewClick(app)} size="1" color="blue">
                    Xét duyệt
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      {/* 👉 Preview CV nếu có */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">📄 Xem trước CV</h3>
              <Button onClick={() => setPreviewUrl(null)} color="gray" variant="soft">
                Đóng
              </Button>
            </div>
            <iframe
              src={previewUrl}
              title="CV Preview"
              className="w-full flex-grow"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;