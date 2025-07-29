import axios from "axios";
const API_URL = "/api/client";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
}

interface CheckEmailParams {
  email: string;
}

interface UserDetailsParams {
  nickname: string;
  birthday: string; // "YYYY-MM-DD" 형식
  gender: string;
}

export const updateUserDetails = async (
  details: UserDetailsParams,
  accessToken: string, // accessToken을 인자로 추가
) => {
  const response = await axios.post(`${API_URL}/users/details`, details, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // 헤더에 토큰 추가
    },
    withCredentials: true,
  });
  return response.data;
};

export const getUserInfo = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const loginUser = async ({ email, password }: LoginParams) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const registerUser = async ({ email, password }: RegisterParams) => {
  const response = await axios.post(
    `${API_URL}/users/signup`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export const checkEmail = async ({ email }: CheckEmailParams) => {
  const response = await axios.get(`${API_URL}/users/email`, {
    params: { email },
  });

  return response.data;
};

export const getUserDetail = async (accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    console.log("유저 디테일", response.data);

    return response.data;
  } catch (error) {
    console.error("getUserDetail 실패:", error);
    throw error;
  }
};
