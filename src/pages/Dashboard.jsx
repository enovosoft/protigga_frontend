import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./Dashboard/AdminDashboard";
import StudentDashboard from "./Dashboard/StudentDashboard";

export default function Dashboard() {
  const { isAuthenticated, isAuthLoading, getPrimaryRole } = useAuth();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  // Render dashboard based on user's primary role
  if (primaryRole === "admin") {
    return <AdminDashboard />;
  } else if (primaryRole === "student") {
    return <StudentDashboard />;
  }

  // Default fallback (if role is not recognized)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">User Role not recognized</h2>
        <p>Please contact support for assistance.</p>

        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate("/auth/logout")}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
