import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

const persistUser = (data) => {
  const { token, ...userData } = data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
  return userData;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        const storedUser = getStoredUser();
        const userData = {
          ...response.data,
          profilePhoto: storedUser?.profilePhoto || ""
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
  }, []);

  const storeSession = (data) => {
    const userData = persistUser(data);
    setUser(userData);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", payload);
      storeSession(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", payload);
      storeSession(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfilePhoto = (profilePhoto) => {
    const nextUser = { ...user, profilePhoto };
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, updateProfilePhoto, isAdmin: user?.role === "Admin" }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
