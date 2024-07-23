import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import AdviceDetails from "./components/advices/AdviceDetails.jsx";
import Ranking from "./components/advices/ranking/Ranking.jsx";
import Categories from "./components/advices/categories/Categories.jsx";
import CategoryDetails from "./components/advices/categories/CategoryDetails.jsx";
import SuggestAdvice from "./components/advices/SuggestAdvice.jsx";
import RandomAdvice from "./components/advices/RandomAdvice.jsx";
import Register from "./components/user/Register.jsx";
import RootLayout from "./router/RootLayout.jsx";
import ActivateUser from "./components/user/ActivateUser.jsx";
import ErrorPage from "./components/common/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/advices", element: <AdviceDetails /> },
      {
        path: "/categories",
        element: <Categories />,
      },
      { path: "/random", element: <RandomAdvice /> },
      { path: "/categories/:id", element: <CategoryDetails /> },
      { path: "/ranking", element: <Ranking /> },
      { path: "/suggest", element: <SuggestAdvice /> },
      { path: "/error", element: <ErrorPage /> },
      {
        path: "/user",
        children: [
          { path: "register", element: <Register /> },
          {
            path: "activate/:token",
            element: <ActivateUser />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
