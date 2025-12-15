import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center h-screen z-2  bg-blue-50">
      <div className="w-full max-w-sm p-6 bg-white border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6">
          Restricted access for administrators
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        {/* Password with eye */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading || !email || !password}
          className={`w-full py-2 rounded text-white transition ${
            loading || !email || !password
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}