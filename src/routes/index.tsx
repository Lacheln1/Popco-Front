import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지
import MainPage from "@/pages/MainPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import WithoutHeaderFooterLayout from "./WithoutHeaderFooterLayout";

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
    path: "/test",
    element: <TestLayout />,
    children: [
      {
        index: true,
        element: <TestPage />,
      },
    ],
  },
  {
    element: <WithoutHeaderFooterLayout />,
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
