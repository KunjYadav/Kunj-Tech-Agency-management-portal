"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

// API requests go through same-site frontend proxy now, to preserve HttpOnly cookies in middleware.
const API_URL = "/api";

// Global Axios config to ensure cookies are sent with every request
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("userInfo");
        if (savedUser) {
          // Verify cookie is still valid by attempting to fetch the profile
          const { data } = await axios.get(`${API_URL}/auth/profile`);
          setUser(data);
          localStorage.setItem("userInfo", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Session expired or invalid:", error);
        localStorage.removeItem("userInfo");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      // Token is now securely set as an HttpOnly cookie by the backend!
      localStorage.setItem("userInfo", JSON.stringify(userData));

      setUser(userData);
      router.push("/dashboard");
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error("Logout failed on server, continuing local cleanup", err);
    }

    localStorage.removeItem("userInfo");
    setUser(null);
    router.push("/login");
  };

  const updateLocalUser = (updatedData) => {
    const newData = { ...user, ...updatedData };
    setUser(newData);
    localStorage.setItem("userInfo", JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateLocalUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
