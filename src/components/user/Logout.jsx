import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth-context";

export default function Logout() {
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("userEmail");
    setAuthToken();
    navigate("/");
  }, []);
  return <>Wylogowywanie użytkownika...</>;
}
