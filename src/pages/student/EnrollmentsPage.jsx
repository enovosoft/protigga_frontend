import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStoreState } from "easy-peasy";
import { useNavigate } from "react-router-dom";

export default function EnrollmentsPage() {
  const enrollments = useStoreState((state) => state.student.enrollments);
  const loading = useStoreState((state) => state.student.loading);
  const navigate = useNavigate();

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-video bg-muted animate-pulse"></div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">My Enrollments</h1>
        {enrollments.length === 0 ? (
          <p className="text-muted-foreground">No enrollments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  navigate("/dashboard/course", {
                    state: { slug: enrollment.slug },
                  })
                }
              >
                <CardHeader className="p-0 relative">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {enrollment.thumbnail ? (
                      <img
                        src={enrollment.thumbnail}
                        alt={enrollment.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                    {/* Batch Tag */}
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      {enrollment.batch}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{enrollment.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}
