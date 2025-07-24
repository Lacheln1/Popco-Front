import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지
import MainPage from "@/pages/MainPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DetailPage from "@/pages/DetailPage";

import WithoutHeaderFooterLayout from "./WithoutHeaderFooterLayout";

import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import KakaoCallback from "@/pages/KakaoCallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/detail/:movieId", element: <DetailPage /> },
      { path: "/list", element: <MainPage /> },
      { path: "/collections", element: <MainPage /> },
      { path: "/analysis", element: <MainPage /> },
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
      {
        path: "/auth/kakao/login",
        element: <KakaoCallback />,
      },
    ],
  },
  {
    path: "/test",
    element: (
      <ConfigProvider
        locale={koKR}
        theme={{
          token: {
            colorPrimary: "#ffd751",
          },
        }}
      >
        <TestLayout />
      </ConfigProvider>
    ),
    children: [
      {
        index: true,
        element: <TestPage />,
      },
    ],
  },
]);

export default router;
