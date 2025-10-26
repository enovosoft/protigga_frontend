import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Book,
  BookCheck,
  BookOpen,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  Package,
  Shield,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated, isAuthLoading, getPrimaryRole } = useAuth();
  const navigate = useNavigate();
  const primaryRole = getPrimaryRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get role-based icon
  const getRoleIcon = () => {
    if (primaryRole === "admin") {
      return <Shield className="w-5 h-5 text-primary" />;
    } else if (primaryRole === "student") {
      return <User className="w-5 h-5 text-primary" />;
    }
    return <User className="w-5 h-5 text-primary" />;
  };

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to access the dashboard
          </h2>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go to home
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    navigate("/auth/logout");
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Shield,
      path: "/admin",
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      path: "/admin/orders",
    },
    {
      id: "enrollments",
      label: "Enrollments",
      icon: GraduationCap,
      path: "/admin/enrollments",
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      path: "/admin/courses",
    },
    {
      id: "books",
      label: "Books",
      icon: Book,
      path: "/admin/books",
    },

    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "exams",
      label: "Exams",
      icon: BookCheck,
      path: "/admin/exams",
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      path: "/admin/notes",
    },
    {
      id: "promo-codes",
      label: "Promo Codes",
      icon: Ticket,
      path: "/admin/promo",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay with blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto w-full">
        {/* Admin Dashboard Header */}
        <div className="px-4 py-4   bg-card border ">
          <div className="flex items-center justify-between container mx-auto">
            <div className="flex items-center gap-4">
              {/* Mobile menu button in header */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <Link to="/" className="flex items-center gap-2 ">
                <h1 className="text-2xl font-bold text-primary font-primary">
                  প্রতিজ্ঞা
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {user?.name && (
                <div className="hidden sm:flex items-center gap-2">
                  {getRoleIcon()}
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {primaryRole?.replace(/_/g, " ") || "User"}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Layout with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-130px)]">
          {/* Sidebar */}
          <div
            className={`w-full md:w-64 bg-card rounded-lg border p-4 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-140px)] md:overflow-y-auto transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            } fixed md:static inset-y-0 left-0 z-50 md:z-auto`}
          >
            {/* Mobile close button */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="text-lg font-semibold text-foreground">
                Admin Panel
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Admin Panel
              </h3>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:ml-0 p-4 lg:p-6 md:overflow-x-auto">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
