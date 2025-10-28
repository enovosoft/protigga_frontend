import ImageFallback from "@/components/shared/ImageFallback";
import PinMessage from "@/components/shared/PinMessage";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStoreState } from "easy-peasy";
import { GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollmentsPage() {
  const enrollments = useStoreState((state) => state.student.enrollments);
  const loading = useStoreState((state) => state.student.loading);
  const navigate = useNavigate();
  const location = useLocation();

  const { message } = location.state || {};

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
        {message?.text && (
          <div className="my-4">
            {" "}
            <PinMessage message={message.text} variant={message.type} />
          </div>
        )}
        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Enrollments Found
              </h3>
              <p className="text-muted-foreground text-center">
                You haven't enrolled in any courses yet. Please enroll in a
                course to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/course/${enrollment.slug}`)}
              >
                <CardHeader className="p-0 relative">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <ImageFallback
                      src={enrollment.thumbnail}
                      alt={enrollment.title}
                    />
                    {/* Batch Tag */}
                    <Badge className="absolute top-3 right-3 bg-secondary text-primary-foreground">
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
