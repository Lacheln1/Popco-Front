import axios from "axios";

const API_URL = "/api/client";

//토큰 갱신 시도(성공: 새로운 토큰 발급, 실패: 재로그인)
export const refreshTokens = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("refreshTokens 실패", error);
    throw error; 
  }
};

// 페이지 렌더링 시 토큰 상태 확인 및 갱신
export const validateAndRefreshTokens = async () => {
  try {
    const checkRefreshToken = await refreshTokens();
    return checkRefreshToken;
  } catch (error) {
    console.error("validateAndRefreshTokens 실패:", error);
    // 에러가 발생하면 INVALID_REFRESH_TOKEN 형태로 반환
    return {
      result: "INVALID_REFRESH_TOKEN",
      data: null
    };
  }
};

//로그아웃 시 토큰 정리
export const clearTokens = async (accessToken?: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  }
};