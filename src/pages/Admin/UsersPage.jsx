import UsersManagement from "@/components/Admin/Users/UsersManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UsersManagement useLayout={false} />
    </AdminLayout>
  );
}
