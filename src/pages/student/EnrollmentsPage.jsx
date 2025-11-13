import ImageFallback from "@/components/shared/ImageFallback";
import PinMessage from "@/components/shared/PinMessage";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAnnouncementStatusBadge } from "@/lib/badgeUtils";
import { useStoreState } from "easy-peasy";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollmentsPage() {
  const enrollments = useStoreState((state) => state.student.enrollments);
  const announcements = useStoreState((state) => state.student.announcements);
  const loading = useStoreState((state) => state.student.loading);
  const navigate = useNavigate();
  const location = useLocation();

  const { message } = location.state || {};

  const isAnnouncementActive = (announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.start_date);
    const endDate = new Date(announcement.end_date);
    return (
      announcement.status === "active" && now >= startDate && now <= endDate
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle2;
      case "scheduled":
        return Clock;
      case "expired":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

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
        {/* Announcements Section */}
        {announcements && announcements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((announcement) => {
                const StatusIcon = getStatusIcon(announcement.status);
                const isActive = isAnnouncementActive(announcement);

                return (
                  <Card
                    key={announcement.id}
                    className={`transition-all duration-200 hover:shadow-md ${
                      isActive ? "ring-2 ring-warning/40 bg-warning/10" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <StatusIcon className="w-5 h-5 mt-0.5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground truncate">
                              {announcement.title}
                            </h4>
                            {getAnnouncementStatusBadge(announcement.status)}
                          </div>
                          {announcement.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {announcement.description}
                            </p>
                          )}
                          {announcement.attachment_url && (
                            <ImageFallback
                              src={announcement.attachment_url}
                              alt="Announcement Attachment"
                              className="mt-2 max-h-48 object-contain rounded"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
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
