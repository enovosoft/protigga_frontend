import EnrollmentsTable, {
  EnrollmentsTableSkeleton,
} from "@/components/Admin/Enrollments/EnrollmentsTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import api from "@/lib/api";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EnrollmentsManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/enrollments");
      if (response.data.success) {
        let enrollments = response.data?.enrollments || [];

        // Sort by created date (newest first)
        enrollments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setEnrollments(enrollments);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleView = (enrollment) => {
    navigate(`/admin/enrollments/${enrollment.id}`, { state: { enrollment } });
  };

  // Pagination
  const totalPages = Math.ceil(enrollments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEnrollments = enrollments.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Enrollments Management
          </h2>
          <p className="text-muted-foreground mt-1">
            View and manage all course enrollments
          </p>
        </div>
      </div>

      {loading ? (
        <EnrollmentsTableSkeleton />
      ) : enrollments.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No enrollments yet</h3>
          <p className="text-muted-foreground mb-4">
            Enrollments will appear here once students start enrolling in
            courses.
          </p>
        </div>
      ) : (
        <>
          <EnrollmentsTable
            enrollments={currentEnrollments}
            startIndex={startIndex}
            onView={handleView}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={enrollments.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}
