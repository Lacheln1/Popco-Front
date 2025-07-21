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
]);

export default router;
