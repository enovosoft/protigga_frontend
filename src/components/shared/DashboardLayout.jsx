import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
const UserDashboardLayout = ({ children }) => {
  const { user, isAuthenticated, isAuthLoading, getPrimaryRole } = useAuth();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole();

  // Get role-based icon
  const getRoleIcon = () => {
    if (primaryRole === "admin") {
      return <Shield className="w-5 h-5 text-primary" />;
    } else if (primaryRole === "student") {
      return <User className="w-5 h-5 text-primary" />;
    }
    return <User className="w-5 h-5 text-primary" />;
  };

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to access the dashboard
          </h2>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go to home
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    navigate("/auth/logout");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-8">
        {/* User Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-primary font-primary">
                  প্রতিজ্ঞা
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {user?.name && (
                <div className="hidden sm:flex items-center gap-2">
                  {getRoleIcon()}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {primaryRole?.replace(/_/g, " ") || "User"}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          <div className="w-full mx-auto">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboardLayout;
