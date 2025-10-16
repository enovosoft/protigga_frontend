import CoursesManagement from "@/components/Admin/Courses/CoursesManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminCoursesPage() {
  return (
    <AdminLayout>
      <CoursesManagement useLayout={false} />
    </AdminLayout>
  );
}
