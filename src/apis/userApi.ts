import axios from "axios";

//백엔드 url 넣어야함
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
  console.log("보낸 이메일:", email);
  console.log("보낸 비번", password);
  console.log(response.data.code);

  return response.data;
};

export const checkEmail = async ({ email }: CheckEmailParams) => {
  const response = await axios.get(`${API_URL}/users/email`, {
    params: { email },
  });
  console.log("중복 확인", response.data);

  return response.data;
};
