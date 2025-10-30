import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components/routing/ProtectedRoute";

import Dashboard from "../Dashboard/Dashboard";

import AnnouncementsPage from "@/pages/student/AnnouncementsPage";
import CoursePage from "@/pages/student/CoursePage";
import EnrollmentsPage from "@/pages/student/EnrollmentsPage";
import ExamPage from "@/pages/student/ExamPage";
import PaymentDetailsPage from "@/pages/student/PaymentDetailsPage";
import PaymentHistoryPage from "@/pages/student/PaymentHistoryPage";
import ProfilePage from "@/pages/student/ProfilePage";
import PaymentStatusPage from "../payment/PaymentStatusPage";

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
    <Route
      path="/dashboard/profile"
      element={
        <ProtectedRoute roles={["student"]}>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/enrollments"
      element={
        <ProtectedRoute roles={["student"]}>
          <EnrollmentsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/course/:slug"
      element={
        <ProtectedRoute roles={["student"]}>
          <CoursePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/payments"
      element={
        <ProtectedRoute roles={["student"]}>
          <PaymentHistoryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/payments/:transactionId"
      element={
        <ProtectedRoute roles={["student"]}>
          <PaymentDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/exams"
      element={
        <ProtectedRoute roles={["student"]}>
          <ExamPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/announcements"
      element={
        <ProtectedRoute roles={["student"]}>
          <AnnouncementsPage />
        </ProtectedRoute>
      }
    />
  </>
);
