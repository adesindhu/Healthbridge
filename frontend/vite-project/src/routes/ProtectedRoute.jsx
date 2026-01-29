import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    // Not logged in → redirect to the login page for this role
    return <Navigate to={`/${role}/login`} replace />;
  }

  if (userRole !== role) {
    // Logged in but wrong role → redirect to their dashboard
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
