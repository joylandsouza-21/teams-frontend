import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const savePushNotificationApi = ({ token, body }) => {
  return api.post(ENDPOINTS.PUSH.SAVE, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const deletePushNotificationApi = (token) => {
  return api.delete(ENDPOINTS.PUSH.DELETE, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};