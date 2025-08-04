import React, { useEffect, useState } from 'react';
import ApplicationsList from '@applicationForms/ApplicationsList';
import { authApis, endpoints } from '@configs/APIs';




const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    authApis()
      .get(endpoints['applications'])
      .then((res) => setApplications(res.data))
      .catch((e) => console.error(e));
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Ứng tuyển từ công việc của bạn
        </h2>

        <div className="bg-white shadow rounded-lg p-6">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có ứng viên nào ứng tuyển.</p>
          ) : (
            <ApplicationsList
              applications={applications}
              onReviewClick={setSelectedApp}
            />
          )}
        </div>
      </div>

      
    </div>
  );
};

export default JobApplicationsPage;
