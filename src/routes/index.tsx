import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestMainPage from "@/pages/TestMainPage";
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
]);

export default router;
