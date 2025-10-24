import Loading from "@/components/shared/Loading";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { useStoreState } from "easy-peasy";
import { Book, CreditCard, GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { loading } = useStoreState((state) => state.student);
  const studentCards = [
    {
      title: "My Courses",
      description: "Access your enrolled courses and track progress.",
      icon: GraduationCap,
      onClick: () => navigate("/dashboard/enrollments"),
    },
    {
      title: "Books Order",
      description: "See your book orders. ",
      icon: Book,
      onClick: () =>
        navigate("/dashboard/payments", {
          state: { filterType: "book_order" },
        }),
    },
    {
      title: "Payment History",
      description: "View your payment history and receipts.",
      icon: CreditCard,
      onClick: () => navigate("/dashboard/payments"),
    },
    {
      title: "Exams",
      description: "View your exam schedule and get exam links.",
      icon: CreditCard,
      onClick: () => navigate("/dashboard/exams"),
    },
    {
      title: "My Profile",
      description: "Update your personal information and preferences.",
      icon: User,
      onClick: () => navigate("/dashboard/profile"),
    },
  ];

  return (
    <StudentDashboardLayout>
      {loading ? (
        <>
          <Loading />{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
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
      )}
    </StudentDashboardLayout>
  );
}
