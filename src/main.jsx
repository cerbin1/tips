import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/router/RootLayout.jsx";
import Home from "./components/home/Home.jsx";
import AdviceDetails from "./components/advices/AdviceDetails.jsx";
import Ranking from "./components/advices/ranking/Ranking.jsx";
import Categories from "./components/advices/Categories.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/advices", element: <AdviceDetails /> },
      { path: "/categories", element: <Categories /> },
      { path: "/ranking", element: <Ranking /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
