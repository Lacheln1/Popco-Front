import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지
import MainPage from "@/pages/MainPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ListPage from "@/pages/ListPage";
import DetailPage from "@/pages/DetailPage";
import CollectionPage from "@/pages/CollectionPage";
import IntroPage from "@/pages/IntroPage";
import WithoutHeaderFooterLayout from "./WithoutHeaderFooterLayout";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import AnalysisPage from "@/pages/AnalysisPage";
import KakaoCallback from "@/pages/KakaoCallback";
import MyPage from "@/pages/MyPage";
import CollectionDetailPage from "@/pages/CollectionDetailPage";
import CollectionCreatePage from "@/pages/CollectionCreatePage";
import EntryRouter from "@/pages/EntryPage";

const router = createBrowserRouter([
  {
    path: "/entry",
    element: <EntryRouter />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "list", element: <ListPage /> },
      { path: "detail/:type/:id", element: <DetailPage /> },
      { path: "collections", element: <CollectionPage /> },
      { path: "collections/create", element: <CollectionCreatePage /> },
      { path: "collections/:collectionId", element: <CollectionDetailPage /> },
      { path: "analysis", element: <AnalysisPage /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
  {
    element: <WithoutHeaderFooterLayout />,
    children: [
      { path: "/intro", element: <IntroPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/auth/kakao/login", element: <KakaoCallback /> },
    ],
  },
  {
    path: "/test",
    element: (
      <ConfigProvider
        locale={koKR}
        theme={{
          token: {
            colorPrimary: "#fa9a00ff",
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
