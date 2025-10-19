import { Route } from "react-router-dom";
import { ProtectedRoute } from "../components/routing/ProtectedRoute";

import Dashboard from "../pages/Dashboard/Dashboard";

import PaymentCancelPage from "../pages/payment/PaymentCancelPage";
import PaymentFailPage from "../pages/payment/PaymentFailPage";
import PaymentSuccessPage from "../pages/payment/PaymentSuccessPage";

export const protectedRoutes = (
  <>
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Public Routes (but require authentication for some features) */}

    <Route
      path="/payment/success"
      element={
        <ProtectedRoute roles={["admin", "student"]}>
          <PaymentSuccessPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/fail"
      element={
        <ProtectedRoute roles={["admin", "student"]}>
          <PaymentFailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/cancel"
      element={
        <ProtectedRoute roles={["admin", "student"]}>
          <PaymentCancelPage />
        </ProtectedRoute>
      }
    />
  </>
);
