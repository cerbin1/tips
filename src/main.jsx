import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home/Home.jsx";
import AdviceDetails from "./components/advices/AdviceDetails.jsx";
import Ranking from "./components/advices/ranking/Ranking.jsx";
import CategoriesStatistics from "./components/advices/categories/CategoriesStatistics.jsx";
import CategoryDetails from "./components/advices/categories/CategoryDetails.jsx";
import RandomAdvice from "./components/advices/RandomAdvice.jsx";
import Register from "./components/user/Register.jsx";
import RootLayout from "./router/RootLayout.jsx";
import ActivateUser from "./components/user/ActivateUser.jsx";
import ErrorPage from "./components/common/ErrorPage.jsx";
import Login from "./components/user/Login.jsx";
import Profile from "./components/user/Profile.jsx";
import PasswordReset from "./components/user/PasswordReset.jsx";
import ChangePassword from "./components/user/PasswordChange.jsx";
import AuthProvider from "./store/auth-context.jsx";
import Logout from "./components/user/Logout.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";
import Suggestions from "./components/Suggestions.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      { path: "/", element: <Home /> },
      { path: "/advices/:adviceId", element: <AdviceDetails /> },
      { path: "/categories", element: <CategoriesStatistics /> },
      { path: "/random", element: <RandomAdvice /> },
      { path: "/categories/:categoryId", element: <CategoryDetails /> },
      { path: "/ranking", element: <Ranking /> },
      {
        path: "/suggest",
        element: (
          <ProtectedRoute>
            <Suggestions />
          </ProtectedRoute>
        ),
      },
      { path: "/error", element: <ErrorPage /> },
      {
        path: "/user",
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
          { path: "logout", element: <Logout /> },
          { path: "profile", element: <Profile /> },
          { path: "activate/:token", element: <ActivateUser /> },
          { path: "password-reset", element: <PasswordReset /> },
          { path: "password-change/:token", element: <ChangePassword /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
