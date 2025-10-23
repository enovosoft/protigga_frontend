import { Route } from "react-router-dom";
import { ProtectedRoute } from "../components/routing/ProtectedRoute";

import Dashboard from "../pages/Dashboard/Dashboard";

import PaymentStatusPage from "../pages/payment/PaymentStatusPage";

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
          <PaymentStatusPage status="success" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/fail"
      element={
        <ProtectedRoute roles={["admin", "student"]}>
          <PaymentStatusPage status="fail" />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/cancel"
      element={
        <ProtectedRoute roles={["admin", "student"]}>
          <PaymentStatusPage status="cancel" />
        </ProtectedRoute>
      }
    />
  </>
);
