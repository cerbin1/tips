import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import AuthProvider from "./store/auth-context";

export const renderWithRouter = (ui) => {
  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

export const renderWithAuthProvider = (ui) => {
  return {
    ...render(ui, { wrapper: AuthProvider }),
  };
};
