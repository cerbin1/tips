import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuthToken } from "../util/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  function setAuthToken(newToken) {
    setToken(newToken);
  }

  const contextValue = useMemo(() => ({ token, setAuthToken }), [token]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
