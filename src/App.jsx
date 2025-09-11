import { Routes, Route } from "react-router-dom";
import LandingPage from './components/Home.jsx';
import Login from "./pages/Auth/Login";
import Register from './pages/Auth/Register.jsx';
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Bits from './pages/Dashboard/Bits.jsx';
import Budget from "./pages/Dashboard/Budgets.jsx";
import Features from './pages/Dashboard/Features.jsx';
import Profile from './pages/Dashboard/Profile.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";  // <-- new layout
import './index.css';
import Stats from "./pages/Dashboard/Stats.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Protected Dashboard routes with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bits" element={<Bits />} />
        <Route path="budget" element={<Budget />} />
        <Route path="features" element={<Features />} />
        <Route path="profile" element={<Profile />} />
        <Route path="stats" element={<Stats/>} />
      </Route>

      {/* fallback (404) */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
