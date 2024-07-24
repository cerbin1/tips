import { Outlet, useLoaderData } from "react-router";
import Header from "../components/header/Header";
import { useEffect } from "react";

export default function RootLayout() {
  const token = useLoaderData();

  useEffect(() => {
    if (!token) {
      return;
    }
  }, [token]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
