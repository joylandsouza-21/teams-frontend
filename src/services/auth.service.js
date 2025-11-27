import api from "../utils/axios";

export const loginApi = async ({ email, password }) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("userData", JSON.stringify(res.data));

    return res.data;

  } catch (err) {
    throw new Error(
      err.response?.data?.error || "Login failed"
    );
  }
};
