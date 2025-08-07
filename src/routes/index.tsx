import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./Layout";
import TestLayout from "@/layout/TestLayout";
import TestPage from "@/pages/TestPage"; // 선호도 진단 페이지
import MainPage from "@/pages/MainPage";
import ListPage from "@/pages/ListPage";
import DetailPage from "@/pages/DetailPage";
import CollectionPage from "@/pages/CollectionPage";
import IntroPage from "@/pages/IntroPage";
import WithoutHeaderFooterLayout from "./WithoutHeaderFooterLayout";
import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import CollectionDetailPage from "@/pages/CollectionDetailPage";
import CollectionCreatePage from "@/pages/CollectionCreatePage";
import EntryRouter from "@/pages/EntryPage";

import Spinner from "@/components/common/Spinner";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const AnalysisPage = lazy(() => import("@/pages/AnalysisPage"));
const KakaoCallback = lazy(() => import("@/pages/KakaoCallback"));
const MyPage = lazy(() => import("@/pages/MyPage"));

const PageLoading = () => {
  return (
    <div>
      <Spinner />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <EntryRouter /> },
      { path: "/home", element: <MainPage /> },
      { path: "/list", element: <ListPage /> },
      { path: "/detail/:type/:id", element: <DetailPage /> },
      { path: "/collections", element: <CollectionPage /> },
      { path: "/collections/create", element: <CollectionCreatePage /> },
      { path: "/collections/:collectionId", element: <CollectionDetailPage /> },
      {
        path: "/analysis",
        element: (
          <Suspense fallback={<PageLoading />}>
            <AnalysisPage />
          </Suspense>
        ),
      },
      {
        path: "/mypage",
        element: (
          <Suspense fallback={<PageLoading />}>
            <MyPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <WithoutHeaderFooterLayout />,
    children: [
      {
        path: "/intro",
        element: (
          <Suspense fallback={<PageLoading />}>
            <IntroPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<PageLoading />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<PageLoading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/auth/kakao/login",
        element: (
          <Suspense fallback={<PageLoading />}>
            <KakaoCallback />
          </Suspense>
        ),
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
