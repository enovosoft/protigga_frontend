import { Button } from "@/components/ui/button";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ArrowLeft, LogOut, User, X } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Loading from "./Loading";
import PinMessage from "./PinMessage";

const StudentDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isFetched, loading, profile } = useStoreState(
    (state) => state.student
  );
  const { fetchStudentDetails, setError } = useStoreActions(
    (actions) => actions.student
  );

  useEffect(() => {
    if (!isFetched && !loading) {
      fetchStudentDetails();
    }
  }, [isFetched, loading, fetchStudentDetails]);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Student Dashboard Header */}
      <div className="px-4 py-4 bg-card border">
        <div className="flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary font-primary">
                প্রতিজ্ঞা
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {profile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.phone}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => navigate("/auth/logout")}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Back Button - Hide on dashboard page */}
      {location.pathname !== "/dashboard" && (
        <div className="p-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-4">
          <div className="relative">
            <PinMessage variant="invalid" message={`Error: ${error}`} />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-2 p-1 h-auto flex justify-center items-center"
              onClick={handleCloseError}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 min-h-screen py-4">
        {children}
      </main>
      {loading && <Loading text="Preparing your journey" />}

      <Footer />
    </div>
  );
};

export default StudentDashboardLayout;
