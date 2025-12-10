import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getConversationsApi = ({ token }) => {
  return api.get(ENDPOINTS.CONVERSATION.GET_ALL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createNewGroupChatApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CONVERSATION.CREATE_GROUP, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const createNewDirectChatApi = ({ token, body }) => {
  return api.post(ENDPOINTS.CONVERSATION.CREATE_DIRECT, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const convertToGroupChatApi = ({ token, conversationId, body }) => {
  return api.post(
    ENDPOINTS.CONVERSATION.CONVERT_TO_GROUP(conversationId),
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};


export const addmembersToGroupChatApi = ({ token, conversationId, body }) => {
  return api.post(
    ENDPOINTS.CONVERSATION.ADD_MEMBERS_TO_GROUP(conversationId),
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const updateConversationApi = ({ token, conversationId, formData }) => {
  return api.post(
    ENDPOINTS.CONVERSATION.UPDATE_CONVERSATION(conversationId),
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    }
  );
};
