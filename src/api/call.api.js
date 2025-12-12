import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const startCallApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CALL.START, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const joinCallApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CALL.JOIN, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const endCallApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CALL.END, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};


export const rejectCallApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CALL.REJECT, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};


export const cancelCallApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CALL.CANCEL, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
