import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import MainPage from "@/pages/MainPage";
import TestLayout from "./TestLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/list", element: <MainPage /> },
      { path: "/collections", element: <MainPage /> },
      { path: "/analysis", element: <MainPage /> },
    ],
  },
  {
    element: <TestLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
