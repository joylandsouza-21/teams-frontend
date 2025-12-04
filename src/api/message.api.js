import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getMessageHistoryApi = ({ token, conversationId, params }) => {
  return api.get(
    ENDPOINTS.MESSAGE.MESSAGE_HISTORY(conversationId),
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
