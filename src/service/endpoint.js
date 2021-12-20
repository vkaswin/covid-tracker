const BASE_URL = "https://data.covid19india.org/v4/min";

export const endpoints = {
  GET_ALL_LIST: `${BASE_URL}/data.min.json`,
  GET_LIST_BY_DATE: `${BASE_URL}/timeseries.min.json`,
};
