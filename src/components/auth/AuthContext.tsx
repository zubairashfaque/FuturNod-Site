import React, { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "../../lib/dbAuth";

type User = {
  username: string;
  role: "admin" | "user";
} | null;

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // Use the database authentication service
      const result = await authenticateUser(username, password);

      if (result.success && result.user) {
        const user = {
          username: result.user.username,
          role: result.user.role as "admin" | "user",
        };
        setUser(user);
        localStorage.setItem("auth_user", JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: user !== null,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
