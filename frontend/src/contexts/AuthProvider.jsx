// src/contexts/AuthProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch (e) {
    console.error("JWT decode failed:", e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // profile data
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const payload = decodeJwt(token);
    if (!payload) {
      setLoading(false);
      return;
    }

    const userRole = payload.role;
    setRole(userRole);

    const endpoint =
      userRole === "INSURER" ? "/insurer/me" : "/dealership/me";

    api
      .get(endpoint)
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);

    const payload = decodeJwt(token);
    const userRole = payload.role;

    setRole(userRole);

    const endpoint =
      userRole === "INSURER" ? "/insurer/me" : "/dealership/me";

    const res = await api.get(endpoint);
    setUser(res.data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
