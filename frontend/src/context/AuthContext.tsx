import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    try {
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        if (parsed && !parsed.roles) parsed.roles = []; // Ensure roles exist
        return parsed;
    } catch {
        return null;
    }
  });
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  // We don't need the useEffect for loading anymore since it's done in initial state

  const login = (data: any) => {
    const { accessToken, ...userData } = data;
    if (!userData.roles) userData.roles = []; // Ensure roles exist
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
