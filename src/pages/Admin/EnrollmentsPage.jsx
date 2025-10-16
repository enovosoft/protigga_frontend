import EnrollmentsManagement from "@/components/Admin/Enrollments/EnrollmentsManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminEnrollmentsPage() {
  return (
    <AdminLayout>
      <EnrollmentsManagement useLayout={false} />
    </AdminLayout>
  );
}
