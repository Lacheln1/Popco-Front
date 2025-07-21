import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";
import TestMainPage from "@/pages/TestMainPage";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지
import MainPage from "@/pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/list", element: <MainPage /> },
      { path: "/collections", element: <MainPage /> },
      { path: "/analysis", element: <MainPage /> },
      { path: "/login", element: <MainPage /> },
    ],
  },
  {
    //Header/Footer가 없는 테스트 페이지
    element: <TestLayout />,
    children: [{ path: "/preference-test", element: <TestPage /> }],
  },
]);

export default router;
