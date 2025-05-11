
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthState, User } from "@/types";
import { authApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Default auth context
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const { toast } = useToast();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await authApi.login(email, password);

    if (response.success && response.data) {
      const { token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Update state
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } else {
      toast({
        title: "Login failed",
        description: response.error || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    authApi.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
