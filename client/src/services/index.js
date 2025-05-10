import axios from "axios";
import { getFullUrl, getHeaders } from "../helpers/utils";

export const get = async (endpoint, data) => {
  const url = getFullUrl(endpoint);
  console.log("GET Request:", { url, data });
  return commonFetch(url, "GET", data);
};

export const post = async (endpoint, data) => {
  const url = getFullUrl(endpoint);
  console.log("POST Request:", { url, data });
  return commonFetch(url, "POST", data);
};

export const commonFetch = async (url, method, data) => {
  try {
    const headers = getHeaders();
    console.log("Request Config:", { url, method, data, headers });

    const response = await axios({
      url,
      method,
      data,
      headers,
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};
