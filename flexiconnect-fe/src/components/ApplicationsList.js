import React from 'react';
import { Table, Badge, Button } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

const ApplicationsList = ({ applications = [], onReviewClick }) => {
  if (!Array.isArray(applications)) return <p className="text-red-600">❌ Lỗi dữ liệu</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📋 Danh sách ứng viên</h2>

      <div className="overflow-x-auto rounded-md border">
        <Table.Root variant="surface" size="2">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Ứng viên</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Công việc</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Thời gian</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CV</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cover Letter</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Trạng thái</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applications.map((app) => (
              <Table.Row key={app.id}>
                <Table.Cell>{app.candidateName}</Table.Cell>
                <Table.Cell>{app.jobPostTitle || app.jobTitle}</Table.Cell>
                <Table.Cell>{new Date(app.appliedAt).toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {app.resumeFile ? (
                    <a
                      href={app.resumeFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Xem CV
                    </a>
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="max-w-[300px] truncate text-gray-700">
                    {app.coverLetter || <em>Không có</em>}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      app.status === 'APPROVED'
                        ? 'green'
                        : app.status === 'REJECTED'
                        ? 'red'
                        : 'gray'
                    }
                  >
                    {app.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => onReviewClick(app)} size="1">
                    Xét duyệt
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default ApplicationsList;
