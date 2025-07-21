import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
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
