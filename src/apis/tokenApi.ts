import { logger } from "@/utils/logger";
import axios, { AxiosError } from "axios";

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
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      logger.info("refreshTokens: 로그인 안 된 상태");
    }
    return null;
  }
};

// 페이지 렌더링 시 토큰 상태 확인 및 갱신
export const validateAndRefreshTokens = async () => {
  try {
    const checkRefreshToken = await refreshTokens();
    return checkRefreshToken;
  } catch (error) {
    logger.debug("validateAndRefreshTokens 실패:", error);
    return "validateAndRefreshTokens 실패";
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
    logger.debug("로그아웃 요청 실패", error);
  }
};
