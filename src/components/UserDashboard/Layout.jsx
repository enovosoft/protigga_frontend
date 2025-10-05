import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

const UserDashboardLayout = ({ children }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Set active view based on current route
  React.useEffect(() => {
    if (location.pathname.includes("/user-dashboard")) {
      setActiveView("profile");
    } else {
      setActiveView("dashboard");
    }
  }, [location]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to access the dashboard
          </h2>
          <Button onClick={() => (window.location.href = "/auth")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleProfileClick = () => {
    setActiveView("profile");
    window.location.href = "/user-dashboard";
  };

  const handleDashboardClick = () => {
    setActiveView("dashboard");
    window.location.href = "/dashboard";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* User Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome, {user?.name || user?.fullName || "User"}
                  </h1>
                  <p className="text-muted-foreground">
                    {user?.phone || "No phone number"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
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
