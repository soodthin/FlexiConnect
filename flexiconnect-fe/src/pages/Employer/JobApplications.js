import React, { useEffect, useState } from 'react';
import ApplicationsList from '../../components/ApplicationsList';
import ReviewApplicationModal from '../../components/ReviewApplicationModal';
import { authApis, endpoints } from '../../configs/APIs';

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    authApis().get(endpoints['applications']).then(res => setApplications(res.data))
      .catch(e => console.error(e));
  }, []);

  const handleReviewSubmit = async (id, data) => {
    try {
      const res = await authApis().put(endpoints['review-application'](id), data);
      setApplications(prev => prev.map(app => app.id === id ? res.data : app));
      setSelectedApp(null);
    } catch (e) { alert('Xét duyệt lỗi'); }
  };

  return (
    <div>
      <h2>Ứng tuyển từ job của bạn</h2>
      <ApplicationsList applications={applications} onReviewClick={setSelectedApp} />
      {selectedApp && (
        <ReviewApplicationModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default JobApplicationsPage;
