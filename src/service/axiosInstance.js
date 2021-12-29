import axios from "axios";

export const axiosIntance = axios.create();

axiosIntance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosIntance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // localStorage.removeItem("token");
      // window.location.href = "/";
    }
    return Promise.reject(error.response);
  }
);
