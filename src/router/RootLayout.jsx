import { Outlet } from "react-router";
import Header from "../components/header/Header";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
