import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestMainPage from "@/pages/TestMainPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [{ index: true, element: <TestMainPage /> }],
    },
]);

export default router;
