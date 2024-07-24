import { redirect } from "react-router";

export function action() {
  localStorage.removeItem("token");
  return redirect("/");
}
