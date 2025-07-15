import './index.css';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployerRegister from './pages/EmployerRegister';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employer-register" element={<EmployerRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;