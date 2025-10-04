import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import LogoutPage from "./pages/auth/LogoutPage";
import AuthIndex from "./pages/auth/index";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
          success: {
            iconTheme: {
              primary: "var(--success)",
              secondary: "var(--success-foreground)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--destructive)",
              secondary: "var(--destructive-foreground)",
            },
          },
        }}
      />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/auth">
            <Route index element={<AuthIndex />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="logout" element={<LogoutPage />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
