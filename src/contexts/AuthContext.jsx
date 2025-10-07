import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [cookies, , removeCookie] = useCookies([
    "access_token",
    "refresh_token",
  ]);

  const checkAuthStatus = useCallback(() => {
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
  }, [cookies.access_token]);

  useEffect(() => {
    // Check if user is authenticated by reading access_token cookie
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = () => {
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

  // Helper function to check if user has a specific role
  const hasRole = (roleName) => {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }
    return user.roles.some((roleObj) => roleObj.role === roleName);
  };

  // Helper function to get user's primary role (first role in the array)
  const getPrimaryRole = () => {
    if (
      !user ||
      !user.roles ||
      !Array.isArray(user.roles) ||
      user.roles.length === 0
    ) {
      return null;
    }

    const primaryRole = user.roles.reduce((prev, current) => {
      return prev.role_code < current.role_code ? prev : current;
    }, user.roles[0].role);

    return primaryRole.role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading: isLoading,
        login,
        logout,
        hasRole,
        getPrimaryRole,
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
