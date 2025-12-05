export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ALL_USERS: "auth/users"
  },

  CONVERSATION: {
    GET_ALL: "/conversations",
    CREATE_GROUP: "/conversations/group",
    CREATE_DIRECT: "/conversations/direct",
    CONVERT_TO_GROUP: (id) => `/conversations/${id}/convert-to-group`,
    ADD_MEMBERS_TO_GROUP: (id) => `/conversations/${id}/members`,
    UPDATE_CONVERSATION: (id) => `/conversations/${id}/update`,
  },

  MESSAGE: {
    MESSAGE_HISTORY: (id) => `/messages/${id}/history`,
  },

  FILES: {
    UPLOAD: "/files/upload"
  }
};
