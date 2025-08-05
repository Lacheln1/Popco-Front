import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}`,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  withCredentials: true,
});

export default axiosInstance;
