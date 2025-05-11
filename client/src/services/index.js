import axios from "axios";
import { getFullUrl, getHeaders } from "../helpers/utils";

export const get = async (endpoint, params = null) => {
  const url = getFullUrl(endpoint);
  console.log("GET Request:", { url, params });
  return commonFetch(url, "GET", null, params);
};

export const post = async (endpoint, data) => {
  const url = getFullUrl(endpoint);
  console.log("POST Request:", { url, data });
  return commonFetch(url, "POST", data);
};

export const put = async (endpoint, data) => {
  const url = getFullUrl(endpoint);
  console.log("PUT Request:", { url, data });
  return commonFetch(url, "PUT", data);
};

export const del = async (endpoint, data) => {
  const url = getFullUrl(endpoint);
  console.log("DELETE Request:", { url, data });
  return commonFetch(url, "DELETE", data);
};

export const commonFetch = async (url, method, data, params) => {
  try {
    const headers = getHeaders();
    console.log("Request Config:", { url, method, data, headers });

    const response = await axios({
      url,
      method,
      data,
      headers,
      params,
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};
