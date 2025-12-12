import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/auth.service";
import { useAuth } from "../../store/auth.context";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, auth } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   if (auth?.token) {
  //     navigate("/chats");
  //   }
  // }, [auth, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginApi(form);

      // ✅ save auth globally
      setAuth(res);

      // ✅ redirect after login
      navigate("/chats");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex min-h-screen items-center justify-center 
    bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] px-4">

    {/* Glass Card */}
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md rounded-2xl 
        bg-white/10 backdrop-blur-xl 
        p-10 shadow-2xl border border-white/20"
    >
      <h1 className="text-3xl font-extrabold text-center 
        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
        bg-clip-text text-transparent mb-2">
        Teams
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 text-center">
          {error}
        </div>
      )}

      <div className="mb-5">
        <label className="block text-indigo-200 text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/90 text-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </div>

      <div className="mb-6">
        <label className="block text-indigo-200 text-sm mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/90 text-gray-900 px-4 py-2 outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
          py-2.5 text-white font-semibold tracking-wide 
          hover:scale-[1.02] transition disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* <div className="mt-6 flex justify-between text-sm text-indigo-200">
        <button type="button" className="hover:text-pink-400">
          Forgot password?
        </button>
        <button type="button" className="hover:text-pink-400">
          Create account
        </button>
      </div> */}
    </form>
  </div>
);

}
