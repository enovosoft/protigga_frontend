import BooksManagement from "@/components/Admin/Books/BooksManagement";
import NotesManagement from "@/components/Admin/Notes/NotesManagement";
import AdminLayout from "@/components/shared/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Book, FileText, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Notes Management Card */}
              <div
                onClick={() => navigate("/dashboard/notes")}
                className="bg-card p-6 rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">
                    Notes Management
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Add, edit, and manage study notes and PDF materials for
                  students. Upload educational content and organize learning
                  resources.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Manage Notes</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>

              {/* Promo Codes Card */}
              <div className="bg-card p-6 rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Ticket className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">
                    Promo Codes
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Create and manage promotional codes for discounts and special
                  offers. Track usage and effectiveness of marketing campaigns.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Manage Codes</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>

              {/* Books Management Card */}
              <div className="bg-card p-6 rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    <Book className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">
                    Books Management
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Manage the book catalog, inventory, and pricing. Add new books
                  and update existing book information.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Manage Books</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "notes":
        return <NotesManagement useLayout={false} />;

      case "promo-codes":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                Promo Codes Management
              </h2>
              <p className="text-muted-foreground mt-2">
                Create and manage promotional codes for your platform
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border text-center">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                Promo codes management feature is under development.
              </p>
            </div>
          </div>
        );

      case "books":
        return <BooksManagement useLayout={false} />;

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
