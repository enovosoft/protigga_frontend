import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/auth/LoginPage";
import LogoutPage from "../pages/auth/LogoutPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyAccountPage from "../pages/auth/VerifyAccountPage";
import AuthIndex from "../pages/auth/index";

// Auth Route Component - Redirects to dashboard if already authenticated
function AuthRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-bold mt-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export const authRoutes = (
  <Route path="/auth">
    <Route
      index
      element={
        <AuthRoute>
          <AuthIndex />
        </AuthRoute>
      }
    />
    <Route
      path="register"
      element={
        <AuthRoute>
          <RegisterPage />
        </AuthRoute>
      }
    />
    <Route
      path="login"
      element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      }
    />
    <Route
      path="verify-account"
      element={
        <AuthRoute>
          <VerifyAccountPage />
        </AuthRoute>
      }
    />
    <Route
      path="reset-password"
      element={
        <AuthRoute>
          <ResetPasswordPage />
        </AuthRoute>
      }
    />
    <Route path="logout" element={<LogoutPage />} />
  </Route>
);
