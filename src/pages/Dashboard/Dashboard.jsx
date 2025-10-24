import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "../student/StudentDashboard";

export default function Dashboard() {
  const { isAuthenticated, isAuthLoading, getPrimaryRole } = useAuth();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      navigate("/");
    } else if (primaryRole === "admin") {
      // Redirect admins to the admin dashboard
      navigate("/admin");
    }
  }, [isAuthenticated, isAuthLoading, navigate, primaryRole]);

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

  // Only students should reach here, admins are redirected
  if (primaryRole === "student") {
    return <StudentDashboard />;
  }

  // Fallback for unrecognized roles
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">User Role not recognized</h2>
        <p>Please contact support for assistance.</p>

        <div className="mt-4">
          <Button onClick={() => navigate("/")} className="mt-4">
            Go to home
          </Button>
        </div>
      </div>
    </div>
  );
}
