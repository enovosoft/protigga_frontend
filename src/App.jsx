import { CookiesProvider } from "react-cookie";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import NotesManagement from "./components/Admin/Notes/NotesManagement";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import NotesPage from "./pages/NotesPage";
import NotesViewPage from "./pages/NotesViewPage";
import LoginPage from "./pages/auth/LoginPage";
import LogoutPage from "./pages/auth/LogoutPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyAccountPage from "./pages/auth/VerifyAccountPage";
import AuthIndex from "./pages/auth/index";

// Protected Route Component - Redirects to home if not authenticated
function ProtectedRoute({ children }) {
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

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

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

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notes"
              element={
                <ProtectedRoute>
                  <NotesManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/view" element={<NotesViewPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:slug" element={<BookDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
