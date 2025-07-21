import axios from "axios";
import { P } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";

//백엔드 url 넣어야함
const API_URL = `${import.meta.env.VITE_BACK_URL}`;

interface LoginParams {
  email: string;
  password: string;
}

export const getUserInfo = async () => {
  //백엔드 getUser url 넣어야함
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const loginUser = async ({ email, password }: LoginParams) => {
  //백엔드 로그인 url 넣어야함
  const response = await axios.post(
    `${API_URL}`,
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
