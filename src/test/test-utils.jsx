import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "../store/auth-context";

export const renderWithRouter = (component) => {
  return {
    ...render(component, { wrapper: BrowserRouter }),
  };
};

export const renderWithAuth = (component) => {
  return {
    ...render(component, { wrapper: AuthProvider }),
  };
};

export const renderWithRouterAndAuth = (component) => {
  return {
    ...render(component, { wrapper: RouterAndAuthProvider }),
  };
};

const RouterAndAuthProvider = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};
