import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getAllUsers = ({ token }) => {
  return api.get(ENDPOINTS.AUTH.ALL_USERS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
