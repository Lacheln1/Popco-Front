import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACK_URL}`;

interface TokenResponse {
  accessToken: string;
}

interface LoginResponse {
  accessToken: string;
}

let accessToken: string | null = null;

//액세스 토큰 설정
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

//액세스 토큰 가져오기
export const getAccessToken = (): string | null => {
  console.log("백엔드에서 보낸 액세스 토큰:", accessToken);

  return accessToken;
};

//쿠키에서 리프레쉬 토큰 읽기
// export const getRefreshTokenFromCookie = (): string | null => {
//   const cookies = document.cookie.split(";");
//   for (const cookie of cookies) {
//     const [name, value] = cookie.trim().split("=");
//     if (name === "refreshToken") {
//       return value;
//     }
//   }
//   return null;
// };

//토큰 갱신 시도(성공: 새로운 토큰 발급, 실패: 재로그인)
export const refreshTokens = async (): Promise<TokenResponse> => {
  try {
    // const refreshTken = getRefreshTokenFromCookie();
    const response = await axios.post<TokenResponse>(
      `${API_URL}/auth/refresh`,
      {},
      {
        // headers: {
        //   ...(refreshTken && { "X-Refresh-Token": refreshTken }),
        // },
        withCredentials: true,
      },
    );
    const { accessToken: newAccessToken } = response.data;

    setAccessToken(newAccessToken); //새로운 액세스 토큰 설정, 리프레쉬 토큰은 서버에서 자동으로 쿠키/헤더로 설정됨
    console.log("newAccessToken", newAccessToken);
    return response.data;
  } catch (error) {
    console.error("토큰 갱신 실패", error);

    if (
      axios.isAxiosError(error) &&
      error.response?.data?.result === "REFRESH_TOKEN_EXPIRED"
    ) {
      console.log("리프레쉬 토큰 만료 - 재로그인 필요");

      setAccessToken(null); // 토큰 갱신 실패 시 로그아웃 처리
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    setAccessToken(null); // 기타 에러
    throw error;
  }
};

// 페이지 렌더링 시 토큰 상태 확인 및 갱신
export const validateAndRefreshTokens = async (): Promise<boolean> => {
  try {
    await refreshTokens(); // /auth/refresh 토큰 갱신 시도

    return true;
  } catch (error) {
    console.error("토큰 검증 및 갱신 실패:", error);

    if (error instanceof Error && error.message === "REFRESH_TOKEN_EXPIRED") {
      // 리프레쉬 토큰 만료인 경우
      console.log("리프레쉬 토큰 만료 - 로그인 페이지로 리다이렉트 필요");
      return false;
    }

    return false; // 기타 에러
  }
};

//로그인 성공 시 토큰 초기 설정
export const initializeTokens = (loginResonse: LoginResponse): void => {
  const { accessToken: initialAccessToken } = loginResonse;

  setAccessToken(initialAccessToken); //액세스 토큰만 메모리에 저장, 리프레쉬토큰은 서버에서 자동으로 쿠키/헤더로 설정됨
  console.log("토큰 초기 설정 성공");
  console.log("초기 설정 토큰 :", initialAccessToken);
};

//로그아웃 시 토큰 정리
export const clearTokens = async (): Promise<void> => {
  try {
    // const refreshTken = getRefreshTokenFromCookie();

    await axios.post(
      `${API_URL}/auth/logout`, //서버에 로그아웃 요청 (쿠키의 리프레쉬 토큰을 x-refresh-token헤더로 전송)
      {},
      {
        // headers: {
        //   ...(refreshTken && { "X-Refresh-Token": refreshTken }),
        // },
        withCredentials: true,
      },
    );
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  } finally {
    setAccessToken(null); //메모리의 액세스 토큰 제거, 리프레쉬 토큰은 서버에서 쿠키 삭제 처리
  }
};

//페이지 로드시 서버에 토큰 유효성 확인 요청
export const checkTokenStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/auth/status`, {
      withCredentials: true,
    });
    return response.data.isValid;
  } catch (error) {
    return false;
  }
};
