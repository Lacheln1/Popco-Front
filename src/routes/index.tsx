import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";

import TestMainPage from "@/pages/TestMainPage";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <TestMainPage /> },
      { path: "/list", element: <TestMainPage /> },
      { path: "/collections", element: <TestMainPage /> },
      { path: "/analysis", element: <TestMainPage /> },
      { path: "/login", element: <TestMainPage /> },
    ],
  },
  {
    //Header/Footer가 없는 테스트 페이지
    element: <TestLayout />,
    children: [
      { path: "/preference-test", element: <TestPage /> },
    ],
  },
]);

export default router;
