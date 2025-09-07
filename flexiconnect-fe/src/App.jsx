import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useReducer } from 'react';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useEffect } from "react";
import { MyUserContext, MyDispatcherContext } from '@contexts/MyContexts';

import MainLayout from '@layouts/MainLayout';
import Dashboard from '@layouts/Dashboard';

import PrivateRoute from '@configs/PrivateRoute';

import Unauthorized from '@auth/Unauthorized';
import Login from '@auth/Login';
import Register from '@auth/Register';
import EmployerRegister from '@auth/EmployerRegister';

import JobDetails from '@public/JobDetails';

import AdminDashboard from "@admin/AdminDashboard";
import EmployerManagement from "@admin/EmployerManagement";
import UserManagement from "@admin/UserManagement";
import JobPostManagement from "@admin/JobPostManagement";

import EmployerDashboard from '@employer/EmployerDashboard';
import EmployerProfile from '@employerProfile/EmployerProfile';
import ApplicationsManagement from '@employer/ApplicationsManagement';

import CandidateDashboard from '@candidate/CandidateDashboard';
import CandidateProfile from '@candidateProfile/CandidateProfile';
import SavedJobs from '@candidate/candidate-profile/SavedJobs';
import Applied from '@candidate/Applied';
import CandidateUpgrade from '@candidate/payment/CandidateUpgrade';
import PaymentSuccess from '@candidate/payment/PaymentSuccess';
import PaymentFailed from '@candidate/payment/PaymentFailed';
import MockInterview from '@candidate/MockInterview';

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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch({ type: "login", payload: JSON.parse(savedUser) });
    }
  }, []);
  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
        <TooltipProvider>
          <BrowserRouter>
            <MainLayout>
              <Toaster richColors position="top-center" />
              {/*Public Routes*/}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employer-register" element={<EmployerRegister />} />
                {/* Admin Routes */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin-pending-employers"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <EmployerManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin-users-management"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <UserManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin-jobposts-management"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <JobPostManagement />
                    </PrivateRoute>
                  }
                />
                { /* Candidate Routes */}
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
                  path="/saved-jobs" element={
                    <PrivateRoute allowedRoles={["CANDIDATE"]}>
                      <SavedJobs />
                    </PrivateRoute>
                  } />
                <Route
                  path="/applied"
                  element={
                    <PrivateRoute allowedRoles={["CANDIDATE"]}>
                      <Applied />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/candidate-upgrade"
                  element={
                    <PrivateRoute allowedRoles={["CANDIDATE"]}>
                      <CandidateUpgrade />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mock-interview"
                  element={
                    <PrivateRoute allowedRoles={["CANDIDATE"]}>
                      <MockInterview />
                    </PrivateRoute>
                  }
                />
                {/* Employer Routes */}
                <Route
                  path="/employer-profile"
                  element={
                    <PrivateRoute allowedRoles={["EMPLOYER"]}>
                      <EmployerProfile />
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
                  path="/employer-applications-management"
                  element={
                    <PrivateRoute allowedRoles={["EMPLOYER"]}>
                      <ApplicationsManagement />
                    </PrivateRoute>
                  }
                />

                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/job-posts/:id" element={<JobDetails />} />

                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />

              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
