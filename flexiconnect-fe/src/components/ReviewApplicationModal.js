import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
`;

const Content = styled(Dialog.Content)`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin: 10% auto;
`;

const ReviewModal = ({ application, onClose, onSubmit }) => {
  const [status, setStatus] = useState(application.status || '');
  const [reason, setReason] = useState(application.rejectionReason || '');

  const submit = () => onSubmit(application.id, { status, reason });

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Overlay />
      <Content>
        <Dialog.Title>Xét duyệt: {application.candidateName}</Dialog.Title>
        <p><strong>Công việc:</strong> {application.jobPostTitle}</p>
        <div>
          <label>Trạng thái:</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">-- chọn --</option>
            <option value="APPROVED">Duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>
        {status === 'REJECTED' && (
          <div>
            <label>Lý do:</label>
            <input value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        )}
        <button onClick={submit}>Gửi</button>
        <button onClick={onClose}>Đóng</button>
      </Content>
    </Dialog.Root>
  );
};

export default ReviewModal;
