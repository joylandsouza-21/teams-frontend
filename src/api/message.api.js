import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getMessageHistoryApi = ({ token, conversationId }) => {
  return api.get(
    ENDPOINTS.MESSAGE.MESSAGE_HISTORY(conversationId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

