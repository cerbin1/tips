import { Navigate } from "react-router";
import { useAuth } from "../store/auth-context";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
}
