import { axiosIntance } from "./axiosInstance";
import { endpoints } from "./endpoint";

export const getAllList = () => {
  return axiosIntance({
    method: "get",
    url: endpoints.GET_ALL_LIST,
  });
};

export const getListByDate = () => {
  return axiosIntance({
    method: "get",
    url: endpoints.GET_LIST_BY_DATE,
  });
};
