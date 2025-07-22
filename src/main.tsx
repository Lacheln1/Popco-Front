import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index";
import { App as AntApp } from 'antd';
import 'antd/dist/reset.css';
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AntApp>
            <RouterProvider router={router} />
        </AntApp>
    </StrictMode>
);