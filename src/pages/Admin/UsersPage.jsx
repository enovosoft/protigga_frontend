import UsersManagement from "@/components/Admin/Users/UsersManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <UsersManagement useLayout={false} />
      </div>
    </AdminLayout>
  );
}
