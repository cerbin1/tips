import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdviceDetails from "./components/advices/AdviceDetails.jsx";
import CategoriesStatistics from "./components/advices/categories/CategoriesStatistics.jsx";
import CategoryDetails from "./components/advices/categories/CategoryDetails.jsx";
import RandomAdvice from "./components/advices/RandomAdvice.jsx";
import Ranking from "./components/advices/ranking/Ranking.jsx";
import ErrorPage from "./components/common/ErrorPage.jsx";
import Home from "./components/home/Home.jsx";
import Suggest from "./components/advices/Suggest.jsx";
import ActivateUser from "./components/user/ActivateUser.jsx";
import Login from "./components/user/Login.jsx";
import Logout from "./components/user/Logout.jsx";
import PasswordChangeForm from "./components/user/PasswordChangeForm.jsx";
import PasswordResetForm from "./components/user/PasswordResetForm.jsx";
import Profile from "./components/user/Profile.jsx";
import Register from "./components/user/Register.jsx";
import "./index.css";
import ProtectedRoute from "./router/ProtectedRoute.jsx";
import RootLayout from "./router/RootLayout.jsx";
import AuthProvider from "./store/auth-context.jsx";
import Suggestions from "./components/advices/Suggestions.jsx";
import SuggestedAdviceDetails from "./components/advices/SuggestedAdviceDetails.jsx";
import SuggestedCategoryDetails from "./components/advices/categories/SuggestedCategoryDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      {
        path: "/advices",
        children: [
          { path: ":adviceId", element: <AdviceDetails /> },
          { path: "suggested/:id", element: <SuggestedAdviceDetails /> },
        ],
      },
      { path: "/random", element: <RandomAdvice /> },
      ,
      { path: "/ranking", element: <Ranking /> },
      {
        path: "/categories",
        children: [
          { path: "", element: <CategoriesStatistics /> },
          { path: "suggested/:id", element: <SuggestedCategoryDetails /> },
          { path: ":categoryId", element: <CategoryDetails /> },
        ],
      },
      {
        path: "/suggest",
        element: (
          <ProtectedRoute>
            <Suggest />
          </ProtectedRoute>
        ),
      },
      {
        path: "/suggestions",
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
          { path: "password-reset", element: <PasswordResetForm /> },
          { path: "password-change/:token", element: <PasswordChangeForm /> },
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
