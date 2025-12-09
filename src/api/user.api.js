import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getAllUsers = ({ token }) => {
  return api.get(ENDPOINTS.AUTH.ALL_USERS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = ({ token, formData }) => {
  return api.post(ENDPOINTS.AUTH.UPDATE_USER, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};