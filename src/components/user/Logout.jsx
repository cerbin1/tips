import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth-context";
import { useEffect } from "react";

export default function Logout() {
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setAuthToken();
    navigate("/");
  }, []);
  return <>Wylogowywanie użytkownika...</>;
}
