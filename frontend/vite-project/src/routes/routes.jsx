// src/routes/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Pages
import AdminLogin from "../auth/AdminLogin.jsx";
import DoctorLogin from "../auth/DoctorLogin.jsx";
import DoctorRegister from "../auth/DoctorRegister.jsx";
import UserLogin from "../auth/UserLogin.jsx";
import UserRegister from "../auth/UserRegister.jsx";
import ForgetPassword from "../auth/ForgetPassword.jsx";

// Admin Dashboards
import AdminDashboard from "../dashboards/admin/AdminDashboard.jsx";
import VerifyDoctors from "../dashboards/admin/VerifyDoctors.jsx";

// Doctor Dashboards
import DoctorDashboard from "../dashboards/doctor/DoctorDashboards.jsx";
import PatientList from "../dashboards/doctor/patientList.jsx";
import ChatWithUser from "../dashboards/doctor/ChatWithUser.jsx";

// User Dashboards
import UserDashboard from "../dashboards/user/UserDashboard.jsx";
import Profile from "../dashboards/user/Profile.jsx";
import HealthOverview from "../dashboards/user/HealthOverview.jsx";

// Protected Route
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-doctors"
        element={
          <ProtectedRoute role="admin">
            <VerifyDoctors />
          </ProtectedRoute>
        }
      />

      {/* Doctor Dashboard */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute role="doctor">
            <PatientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/chat"
        element={
          <ProtectedRoute role="doctor">
            <ChatWithUser />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/health"
        element={
          <ProtectedRoute role="user">
            <HealthOverview />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
