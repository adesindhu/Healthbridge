import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) {
    return <Navigate to="/" />;
  }

  return children;
}
