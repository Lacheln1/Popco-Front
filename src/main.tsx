import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index";

import { App as AntApp, ConfigProvider } from 'antd'; 
import koKR from 'antd/locale/ko_KR'; //antd 한국어팩 추가
import 'dayjs/locale/ko'; 
import dayjs from 'dayjs'; 

import 'antd/dist/reset.css';
import "./index.css";

dayjs.locale('ko');

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConfigProvider locale={koKR}>
            <AntApp>
                <RouterProvider router={router} />
            </AntApp>
        </ConfigProvider>
    </StrictMode>
);