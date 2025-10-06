import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Book, FileText, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const studentCards = [
    {
      title: "My Courses",
      description: "Access your enrolled courses and track progress.",
      icon: GraduationCap,
      onClick: () => navigate("/courses"),
    },
    {
      title: "Study Notes",
      description: "Review and manage your study materials.",
      icon: FileText,
      onClick: () => navigate("/notes"),
    },
    {
      title: "Books",
      description: "Browse and purchase educational books.",
      icon: Book,
      onClick: () => navigate("/books"),
    },
  ];

  return (
    <UserDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to your learning dashboard. Here you can access your
              courses, notes, and books.
            </p>
          </div>
        </div>

        {studentCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={card.onClick}
              className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </UserDashboardLayout>
  );
}
