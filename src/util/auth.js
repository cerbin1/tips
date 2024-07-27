import { redirect } from "react-router-dom";

export function tokenLoader() {
  return getAuthToken();
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return token;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/user/login");
  }

  return null;
}

export function getUserRoles() {
  const roles = localStorage.getItem("roles");
  if (!roles) {
    return null;
  }

  return roles;
}
