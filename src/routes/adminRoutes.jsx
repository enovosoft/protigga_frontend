import { Route } from "react-router-dom";
import { ProtectedRoute } from "../components/routing/ProtectedRoute";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AnnouncementsPage from "../pages/Admin/AnnouncementsPage";
import AdminBooksPage from "../pages/Admin/BooksPage";
import CourseEditPage from "../pages/Admin/Courses/CourseEditPage";
import AdminCoursesPage from "../pages/Admin/CoursesPage";
import EnrollmentDetailsPage from "../pages/Admin/Enrollments/EnrollmentDetailsPage";
import AdminEnrollmentsPage from "../pages/Admin/EnrollmentsPage";
import ExamsPage from "../pages/Admin/ExamsPage";
import LiveClassesPage from "../pages/Admin/LiveClassesPage";
import AdminNotesPage from "../pages/Admin/NotesPage";
import OrderDetailsPage from "../pages/Admin/Orders/OrderDetailsPage";
import AdminOrdersPage from "../pages/Admin/OrdersPage";
import AdminPromoPage from "../pages/Admin/PromoPage";
import UserDetailsPage from "../pages/Admin/Users/UserDetailsPage";
import AdminUsersPage from "../pages/Admin/UsersPage";

export const adminRoutes = (
  <>
    {/* Admin Routes - Protected by role */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/books"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminBooksPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/orders"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminOrdersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/orders/:orderId"
      element={
        <ProtectedRoute roles={["admin"]}>
          <OrderDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/enrollments"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminEnrollmentsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/enrollments/:id"
      element={
        <ProtectedRoute roles={["admin"]}>
          <EnrollmentDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminUsersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users/:id"
      element={
        <ProtectedRoute roles={["admin"]}>
          <UserDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/courses"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminCoursesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/courses/:slug"
      element={
        <ProtectedRoute roles={["admin"]}>
          <CourseEditPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/notes"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminNotesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/promo"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminPromoPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/exams"
      element={
        <ProtectedRoute roles={["admin"]}>
          <ExamsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/live-classes"
      element={
        <ProtectedRoute roles={["admin"]}>
          <LiveClassesPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/announcements"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AnnouncementsPage />
        </ProtectedRoute>
      }
    />
  </>
);
