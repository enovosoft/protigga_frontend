import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
const UserDashboardLayout = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const navigate = useNavigate();

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
      <div className="container mx-auto px-4 py-8">
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

            <div className="flex items-center gap-2">
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
