import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import CandidateProfile from "./pages/Candidate/CandidateProfile";
import EmployerProfile from "./pages/Employer/EmployerProfile";
import EmployerRegister from "./pages/Auth/EmployerRegister";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./pages/Auth/Unauthorized";
import Dashboard from "./components/JobPostList";
import { MyUserContext, MyDispatcherContext } from "./configs/MyContexts";
import { useReducer } from "react";

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
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
