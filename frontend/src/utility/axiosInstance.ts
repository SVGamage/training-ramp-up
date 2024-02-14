import axios from "axios";
const url = process.env.REACT_APP_BACKEND;
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(
        "Access token expired. Refreshing...",
        originalRequest._retry
      );
      originalRequest._retry = true;

      try {
        await axios.post(
          `${url}/users/refreshtoken`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("Token refreshed successfully");

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);
