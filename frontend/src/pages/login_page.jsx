// ===============================================
// src/pages/login_page.jsx
// ===============================================
import React, { useState } from "react";
import { Car, Lock, User, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/auth_service";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(username, password);

      if (onLogin) {
        onLogin(data.user);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Username atau password salah"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center mb-4">
            <Car className="text-white" size={45} />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Smart Parking
          </h1>

          <p className="text-slate-400 mt-2">
            Trinity V2
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <h2 className="text-white text-2xl font-bold text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Username
              </label>

              <div className="relative">
                <User
                  className="absolute left-4 top-4 text-slate-400"
                  size={20}
                />

                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-4 text-slate-400"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-4 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}