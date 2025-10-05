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
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import NotesPage from "./pages/NotesPage";
import NotesViewPage from "./pages/NotesViewPage";
import { CookiesProvider } from "react-cookie";
import BooksPage from "./pages/BooksPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <CookiesProvider>
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
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/view" element={<NotesViewPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
