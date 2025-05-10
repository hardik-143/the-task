import { get, post } from ".";

export const login = async (data) => {
  return post("/auth/login", data);
};

export const register = async (data) => {
  return post("/auth/register", data);
};

export const logout = async () => {
  return post("/auth/logout");
};

export const checkAuth = async () => {
  return get("/auth/check");
};

