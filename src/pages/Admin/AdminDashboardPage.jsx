import AdminLayout from "@/components/shared/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-2">
            Welcome back {user?.name || "admin"}, Manage your platform and study
            materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>
    </AdminLayout>
  );
}
