import ExamsManagement from "@/components/Admin/Exams/ExamsManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function ExamsPage() {
  return (
    <AdminLayout>
      <ExamsManagement useLayout={false} />
    </AdminLayout>
  );
}
