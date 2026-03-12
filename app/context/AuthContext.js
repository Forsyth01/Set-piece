"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  getCustomer,
  renewAccessToken,
} from "@/app/lib/shopify/customer";

const AuthContext = createContext();

const AUTH_TOKEN_KEY = "shopify_customer_token";
const AUTH_EXPIRY_KEY = "shopify_customer_token_expiry";

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get stored token
  const getStoredToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  // Get stored expiry
  const getStoredExpiry = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_EXPIRY_KEY);
  }, []);

  // Store token
  const storeToken = useCallback((token, expiresAt) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_EXPIRY_KEY, expiresAt);
  }, []);

  // Clear token
  const clearToken = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    const expiry = getStoredExpiry();
    if (!expiry) return true;
    return new Date(expiry) < new Date();
  }, [getStoredExpiry]);

  // Fetch customer data with token
  const fetchCustomer = useCallback(async (token) => {
    const result = await getCustomer(token);
    if (result.success) {
      setCustomer(result.customer);
      setIsAuthenticated(true);
      return true;
    } else {
      // Token invalid, clear it
      clearToken();
      setCustomer(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [clearToken]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired()) {
        // Try to renew
        const renewResult = await renewAccessToken(token);
        if (renewResult.success) {
          storeToken(renewResult.accessToken, renewResult.expiresAt);
          await fetchCustomer(renewResult.accessToken);
        } else {
          clearToken();
        }
      } else {
        await fetchCustomer(token);
      }

      setIsLoading(false);
    };

    initAuth();
  }, [getStoredToken, isTokenExpired, storeToken, clearToken, fetchCustomer]);

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await loginCustomer(email, password);

      if (result.success) {
        storeToken(result.accessToken, result.expiresAt);
        await fetchCustomer(result.accessToken);
        return { success: true };
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      return { success: false, errors: [error.message || "Login failed"] };
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async ({ email, password, firstName, lastName, acceptsMarketing }) => {
    setIsLoading(true);
    try {
      const result = await registerCustomer({
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing,
      });

      if (result.success) {
        // Auto-login after successful registration
        const loginResult = await login(email, password);
        return loginResult;
      } else {
        return { success: false, errors: result.errors };
      }
    } catch (error) {
      return { success: false, errors: [error.message || "Registration failed"] };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      if (token) {
        await logoutCustomer(token);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearToken();
      setCustomer(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Refresh customer data
  const refreshCustomer = async () => {
    const token = getStoredToken();
    if (token) {
      await fetchCustomer(token);
    }
  };

  const value = {
    customer,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
