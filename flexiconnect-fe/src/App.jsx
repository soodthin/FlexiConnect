import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useReducer, useEffect } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { MyUserContext, MyDispatcherContext } from "@contexts/MyContexts";
import { AnimatePresence, motion } from "framer-motion";
import 'leaflet/dist/leaflet.css';

import MainLayout from "@layouts/MainLayout";
import Dashboard from "@layouts/Dashboard";

import PrivateRoute from "@configs/PrivateRoute";

import Unauthorized from "@auth/Unauthorized";
import Login from "@auth/Login";
import Register from "@auth/Register";
import EmployerRegister from "@auth/EmployerRegister";

import JobDetails from "@public/JobDetails";

import AdminDashboard from "@admin/AdminDashboard";
import EmployerManagement from "@admin/EmployerManagement";
import UserManagement from "@admin/UserManagement";
import JobPostManagement from "@admin/JobPostManagement";

import EmployerDashboard from "@employer/EmployerDashboard";
import EmployerProfile from "@employerProfile/EmployerProfile";
import ApplicationsManagement from "@employer/ApplicationsManagement";

import CandidateDashboard from "@candidate/CandidateDashboard";
import CandidateProfile from "@candidateProfile/CandidateProfile";
import SavedJobs from "@candidate/candidate-profile/SavedJobs";
import Applied from "@candidate/Applied";
import CandidateUpgrade from "@candidate/payment/CandidateUpgrade";
import PaymentSuccess from "@candidate/payment/PaymentSuccess";
import PaymentFailed from "@candidate/payment/PaymentFailed";
import MockInterview from "@candidate/MockInterview";

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

// 🔹 Component AnimatedRoutes để quản lý route + motion
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/employer-register"
          element={
            <PageWrapper>
              <EmployerRegister />
            </PageWrapper>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-pending-employers"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <PageWrapper>
                <EmployerManagement />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-users-management"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <PageWrapper>
                <UserManagement />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-jobposts-management"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <PageWrapper>
                <JobPostManagement />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        {/* Candidate Routes */}
        <Route
          path="/candidate-dashboard"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <CandidateDashboard />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-profile"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <CandidateProfile />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <SavedJobs />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/applied"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <Applied />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate-upgrade"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <CandidateUpgrade />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/mock-interview"
          element={
            <PrivateRoute allowedRoles={["CANDIDATE"]}>
              <PageWrapper>
                <MockInterview />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path="/employer-profile"
          element={
            <PrivateRoute allowedRoles={["EMPLOYER"]}>
              <PageWrapper>
                <EmployerProfile />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-dashboard"
          element={
            <PrivateRoute allowedRoles={["EMPLOYER"]}>
              <PageWrapper>
                <EmployerDashboard />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/employer-applications-management"
          element={
            <PrivateRoute allowedRoles={["EMPLOYER"]}>
              <PageWrapper>
                <ApplicationsManagement />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        {/* Public */}
        <Route
          path="/unauthorized"
          element={
            <PageWrapper>
              <Unauthorized />
            </PageWrapper>
          }
        />
        <Route
          path="/job-posts/:id"
          element={
            <PageWrapper>
              <JobDetails />
            </PageWrapper>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PageWrapper>
              <PaymentSuccess />
            </PageWrapper>
          }
        />
        <Route
          path="/payment-failed"
          element={
            <PageWrapper>
              <PaymentFailed />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// 🔹 Wrapper cho từng page để tạo hiệu ứng chuyển trang
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-[80vh]"
    >
      {children}
    </motion.div>
  );
}


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
              <AnimatedRoutes />
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
