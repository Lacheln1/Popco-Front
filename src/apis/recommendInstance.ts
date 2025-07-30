import axios from "axios";

const recommendInstance = axios.create({
  baseURL: import.meta.env.VITE_RECOMMEND_URL,
  withCredentials: true,
});

export default recommendInstance;
