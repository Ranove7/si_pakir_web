import React, { useEffect, useState } from "react";
import LoginPage from "./pages/login_page";
import DashboardPage from "./pages/dashboard_page";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // cek token saat app pertama kali dibuka / refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  // setelah login sukses
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  // loading saat cek token
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardPage onLogout={handleLogout} />
      )}
    </>
  );
}