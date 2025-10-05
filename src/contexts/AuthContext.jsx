import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);

  useEffect(() => {
    // Check if user is authenticated by reading access_token cookie
    checkAuthStatus();
  }, [cookies]);

  const checkAuthStatus = () => {
    try {
      // Read access_token from cookies using js-cookie
      const accessToken = cookies.access_token;
      if (accessToken) {
        // Decode the JWT token to get user data
        const decodedToken = jwtDecode(accessToken);

        setUser(decodedToken);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error reading access token:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, userData) => {
    // The login function is called after successful login
    // The cookies are already set by the backend
    // Just refresh the auth status to read the new cookies
    checkAuthStatus();
  };

  const logout = () => {
    // Remove cookies directly using js-cookie
    removeCookie("access_token");
    removeCookie("refresh_token");

    // Clear local state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuthStatus, // Expose this for manual refresh if needed
      }}
    >
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
