import { Button } from "@/components/ui/button";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ArrowLeft, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import PinMessage from "./PinMessage";

const StudentDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { error, isFetched, loading } = useStoreState((state) => state.student);
  const { fetchStudentDetails, setError } = useStoreActions(
    (actions) => actions.student
  );

  useEffect(() => {
    if (!isFetched && !loading) {
      fetchStudentDetails();
    }
  }, [isFetched, loading, fetchStudentDetails]);

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="p-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

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
      <main className="container mx-auto px-4 pb-8">
        {children}
        {loading && <Loading />}
      </main>
    </div>
  );
};

export default StudentDashboardLayout;
