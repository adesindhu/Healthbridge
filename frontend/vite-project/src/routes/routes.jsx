// src/routes/routes.jsx
import { Routes, Route } from "react-router-dom";

/* ===== Public Pages ===== */
import LandingPage from "../pages/LandingPage";
import Appointment from "../pages/Appointment";
import Doctors from "../pages/Doctors";
import Services from "../pages/Services";

/* ===== Auth Pages ===== */
import UserLogin from "../auth/UserLogin";
import UserRegister from "../auth/UserRegister";
import DoctorLogin from "../auth/DoctorLogin";
import DoctorRegister from "../auth/DoctorRegister";

/* ===== Dashboards ===== */
import UserDashboard from "../dashboards/user/UserDashboard";
import HealthOverview from "../dashboards/user/HealthOverview";
import Profile from "../dashboards/user/Profile";

import DoctorDashboard from "../dashboards/doctor/DoctorDashboards";
import PatientList from "../dashboards/doctor/patientList";
import ChatWithUser from "../dashboards/doctor/ChatWithUser";

import AdminDashboard from "../dashboards/admin/AdminDashboard";
import VerifyDoctors from "../dashboards/admin/VerifyDoctors";

/* ===== Protected Routes ===== */
import UserProtectedRoute from "../protected/UserProtectedRoute";
import DoctorProtectedRoute from "../protected/DoctorProtectedRoute";
import AdminProtectedRoute from "../protected/AdminProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<LandingPage />} />
       <Route path="/appointments" element={<Appointment />} />
       <Route path="/Doctors" element={<Doctors />} />
       <Route path="/Services" element={<Services />} />


      {/* ===== USER AUTH ===== */}
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/register/user" element={<UserRegister />} />

      {/* ===== DOCTOR AUTH ===== */}
      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />

      {/* ===== USER DASHBOARD ===== */}
      <Route
        path="/user/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/health"
        element={
          <UserProtectedRoute>
            <HealthOverview />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        }
      />

      {/* ===== DOCTOR DASHBOARD ===== */}
      <Route
        path="/doctor/dashboard"
        element={
          <DoctorProtectedRoute>
            <DoctorDashboard />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <DoctorProtectedRoute>
            <PatientList />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/chat"
        element={
          <DoctorProtectedRoute>
            <ChatWithUser />
          </DoctorProtectedRoute>
        }
      />

      {/* ===== ADMIN DASHBOARD ===== */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-doctors"
        element={
          <AdminProtectedRoute>
            <VerifyDoctors />
          </AdminProtectedRoute>
        }
      />

      {/* ===== 404 ===== */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-white bg-black text-2xl font-bold">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
