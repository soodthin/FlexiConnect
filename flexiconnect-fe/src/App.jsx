import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useReducer } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { MyUserContext, MyDispatcherContext } from '@contexts/MyContexts';

import MainLayout from '@layouts/MainLayout';
import Dashboard from '@layouts/Dashboard';

import PrivateRoute from '@configs/PrivateRoute';

import Unauthorized from '@auth/Unauthorized';
import Login from '@auth/Login';
import Register from '@auth/Register';
import EmployerRegister from '@auth/EmployerRegister';

import JobDetails from '@public/JobDetails';

import EmployerDashboard from '@employer/EmployerDashboard';
import EmployerProfile from '@employerProfile/EmployerProfile';
import JobApplications from '@jobPosts/JobApplications';
import JobPostsManagement from '@jobPosts/JobPostsManagement';

import CandidateDashboard from '@candidate/CandidateDashboard';
import CandidateProfile from '@candidateProfile/CandidateProfile';


const userReducer = (current, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
    default:
      return current;
  }
};

function App() {
  const [user, dispatch] = useReducer(userReducer, null);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
         <TooltipProvider>
        <BrowserRouter>
          <MainLayout>
            <Toaster richColors position="top-center" />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/employer-register" element={<EmployerRegister />} />
              <Route
                path="/candidate-dashboard"
                element={
                  <PrivateRoute allowedRoles={["CANDIDATE"]}>
                    <CandidateDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/candidate-profile"
                element={
                  <PrivateRoute allowedRoles={["CANDIDATE"]}>
                    <CandidateProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employer-profile"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYER"]}>
                    <EmployerProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employer-jobposts-management"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYER"]}>
                    <JobPostsManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employer-dashboard"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYER"]}>
                    <EmployerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employer-job-applications"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYER"]}>
                    <JobApplications />
                  </PrivateRoute>
                }
                />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/job-posts/:id" element={<JobDetails />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
        </TooltipProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
