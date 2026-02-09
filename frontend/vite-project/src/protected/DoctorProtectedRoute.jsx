import { Navigate } from "react-router-dom";

export default function DoctorProtectedRoute({ children }) {
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  if (!doctor) {
    return <Navigate to="/login/doctor" />;
  }

  // 🔐 VERY IMPORTANT: only verified doctors
  if (doctor.status !== "approved") {
    return <Navigate to="/login/doctor" />;
  }

  return children;
}
