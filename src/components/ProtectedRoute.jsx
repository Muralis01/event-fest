import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // remember where the user wanted to go
    return <Navigate to="/student/login" replace state={{ from: location }} />;
  }
  return children;
}
