import axios, { AxiosRequestConfig } from "axios";
import { serverConfig } from "../config/server-config";
import { logout } from "../common/auth";
import user from "./userServices";

const API = (config: AxiosRequestConfig) => {
  const localStorageData = JSON.parse(localStorage?.getItem("user") || "{}");
  if (localStorageData) {
    const token = localStorageData?.JWTToken;
    if (token != null) {
      config.headers = {
        ...config.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        Authorization: "Bearer " + token,
      };
    }
  }

  axios.interceptors.response.use(
    async (response) => {
      try {
        // Make the additional API call on success
        // await user.refreshToken();
      } catch (error) {
        console.error("Error in additional API call:", error);
        throw error;
      }
      return response;
    },
    function (error) {
      if (!error.response) {
        error.response = {
          data: "INTERNAL SERVER ERROR",
          status: 500,
        };
      }
      if (error.response.status === 401) {
        logout();
        throw error;
      }
      return Promise.reject(error);
    }
  );

  return axios(config);
};

export default API;