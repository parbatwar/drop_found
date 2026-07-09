import apiClient from "./client";

export const updateProfile = (data) => {
  return apiClient.put("/users/me", data);
};

export const getProfile = () => {
  return apiClient.get("/users/me");
};