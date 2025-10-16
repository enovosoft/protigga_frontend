import BooksManagement from "@/components/Admin/Books/BooksManagement";
import CoursesManagement from "@/components/Admin/Courses/CoursesManagement";
import NotesManagement from "@/components/Admin/Notes/NotesManagement";
import OrdersManagement from "@/components/Admin/Orders/OrdersManagement";
import PromoManagement from "@/components/Admin/Promo/PromoManagement";
import AdminLayout from "@/components/shared/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  const renderContent = (activeSection) => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h2>
              <p className="text-muted-foreground mt-2">
                Welcome back {user?.name || "admin"}, Manage your platform and
                study materials
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          </div>
        );

      case "notes":
        return <NotesManagement useLayout={false} />;

      case "promo-codes":
        return <PromoManagement useLayout={false} />;

      case "books":
        return <BooksManagement useLayout={false} />;

      case "orders":
        return <OrdersManagement useLayout={false} />;

      case "courses":
        return <CoursesManagement useLayout={false} />;

      default:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h2>
              <p className="text-muted-foreground mt-2">
                Welcome back {user?.name || "admin"}
              </p>
            </div>
          </div>
        );
    }
  };

  return <AdminLayout>{renderContent}</AdminLayout>;
}
