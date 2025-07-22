import axios from "axios";

//백엔드 url 넣어야함
const API_URL = `${import.meta.env.VITE_BACK_URL}`;

interface LoginParams {
  email: string;
  password: string;
}

export const getUserInfo = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const loginUser = async ({ email, password }: LoginParams) => {
  //백엔드 로그인 url 넣어야함
  const response = await axios.post(
    `${API_URL}/api/client/auth/login`,
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
