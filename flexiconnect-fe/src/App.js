import './index.css';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import EmployerRegister from './pages/Auth/EmployerRegister';
import CandidateDashboard from './pages/Candidate/CandidateDashboard';
import CandidateProfile from './pages/Candidate/CandidateProfile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CandidateDashboard />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/employer-register" element={<EmployerRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;