import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useReducer } from "react";
import { MyUserContext, MyDispatcherContext } from "./configs/MyContexts";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./configs/PrivateRoute";
import Unauthorized from "./pages/Auth/Unauthorized";
import Dashboard from "./layouts/Dashboard";
import { Toaster } from "sonner";


import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import JobDetails from "./pages/Public/JobDetails"; 

import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerProfile from "./pages/Employer/EmployerProfile";
import EmployerRegister from "./pages/Auth/EmployerRegister";

import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import CandidateProfile from "./pages/Candidate/CandidateProfile";
import JobApplications from "./pages/Employer/JobApplications";


import JobPostsManagement from "./pages/Employer/JobPostsManagement";

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
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
