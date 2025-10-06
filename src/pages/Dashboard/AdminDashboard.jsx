import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <UserDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground mt-2">
              welcome back {user?.name || "admin"}, Manage your platform and
              study materials
            </p>
          </div>
        </div>

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
            Add, edit, and manage study notes and PDF materials for students.
            Upload educational content and organize learning resources.
          </p>
          <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
            <span>Manage Notes</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>

        {/* Placeholder Cards - Coming Soon */}
        <div className="md:col-span-2 lg:col-span-2 bg-muted/30 p-6 rounded-lg border-2 border-dashed border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-lg">🚀</span>
            </div>
            <h3 className="font-semibold text-lg text-muted-foreground">
              More Features Coming Soon
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            We're working on additional admin features including user
            management, course management, analytics, and system settings.
          </p>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
