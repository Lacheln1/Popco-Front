import axios from "axios";

const API_URL = "/api/client";

//토큰 갱신 시도(성공: 새로운 토큰 발급, 실패: 재로그인)
export const refreshTokens = async () => {
  try {
    console.log("🔍 refreshTokens 시작");
    console.log("🔍 API_URL:", API_URL);

    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );

    console.log("✅ refreshTokens 성공");
    console.log("✅ response.data:", response.data);
    console.log("✅ response.data.result:", response.data?.result);
    console.log("✅ response.data.data:", response.data?.data);
    console.log(
      "✅ response.data.data.accessToken:",
      response.data?.data?.accessToken,
    );

    return response.data;
  } catch (error) {
    console.error("❌ refreshTokens 실패", error);
  }
};

// 페이지 렌더링 시 토큰 상태 확인 및 갱신
export const validateAndRefreshTokens = async () => {
  try {
    console.log("🔍 validateAndRefreshTokens 시작");
    const checkRefreshToken = await refreshTokens();
    console.log("🔍 checkRefreshToken:", checkRefreshToken);
    return checkRefreshToken;
  } catch (error) {
    console.error("validateAndRefreshTokens 실패:", error);
    return "validateAndRefreshTokens 실패";
  }
};

//로그아웃 시 토큰 정리
export const clearTokens = async (accessToken?: string): Promise<void> => {
  try {
    console.log("🔍 clearTokens 시작, 토큰:", accessToken);

    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        withCredentials: true,
      },
    );
    console.log("✅ 로그아웃 성공");
    console.log("로그아웃 액세스토큰", accessToken);
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  }
};
