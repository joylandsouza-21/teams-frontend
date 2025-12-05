import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const uploadFilesApi = ({ token, files }) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return api.post(ENDPOINTS.FILES.UPLOAD, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
