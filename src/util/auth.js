import { redirect } from "react-router-dom";

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return token;
}

export function getUserRoles() {
  const roles = localStorage.getItem("roles");
  if (!roles) {
    return null;
  }

  return roles;
}

export function getUserEmail() {
  return localStorage.getItem("userEmail");
}
