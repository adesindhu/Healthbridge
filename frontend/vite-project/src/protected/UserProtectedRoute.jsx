import { Navigate } from "react-router-dom";

export default function UserProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login/user" />;
  }

  return children;
}
