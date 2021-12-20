import axios from "axios";
import { endpoints } from "./endpoint";

export const getAllList = () => {
  return axios({
    method: "get",
    url: endpoints.GET_ALL_LIST,
  });
};

export const getListByDate = () => {
  return axios({
    method: "get",
    url: endpoints.GET_LIST_BY_DATE,
  });
};
