import { StoreProvider, store } from "@/store";
import { CookiesProvider } from "react-cookie";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { protectedRoutes } from "./pages/student/protectedRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { authRoutes } from "./routes/authRoutes";
import { publicRoutes } from "./routes/publicRoutes";

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <CookiesProvider>
          <StoreProvider store={store}>
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
                  {publicRoutes}
                  {authRoutes}
                  {protectedRoutes}
                  {adminRoutes}
                </Routes>
              </Router>
            </AuthProvider>
          </StoreProvider>
        </CookiesProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
