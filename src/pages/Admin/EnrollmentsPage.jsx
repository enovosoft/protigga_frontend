import EnrollmentsManagement from "@/components/Admin/Enrollments/EnrollmentsManagement";
import ManualEnrollmentDialog from "@/components/Admin/Enrollments/ManualEnrollmentDialog";
import AdminLayout from "@/components/shared/AdminLayout";
import { useRef } from "react";

export default function AdminEnrollmentsPage() {
  const enrollmentsManagementRef = useRef();

  const handleEnrollmentCreated = () => {
    if (enrollmentsManagementRef.current) {
      enrollmentsManagementRef.current.fetchEnrollments();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Enrollments Management
            </h1>
            <p className="text-muted-foreground">
              Manage and view all course enrollments
            </p>
          </div>
          <div className="flex-shrink-0">
            <ManualEnrollmentDialog
              onEnrollmentCreated={handleEnrollmentCreated}
            />
          </div>
        </div>
        <EnrollmentsManagement
          ref={enrollmentsManagementRef}
          useLayout={false}
        />
      </div>
    </AdminLayout>
  );
}
