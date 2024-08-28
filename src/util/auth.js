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
