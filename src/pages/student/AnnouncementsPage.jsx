import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnnouncementStatusBadge } from "@/lib/badgeUtils";
import { format } from "date-fns";
import { useStoreState } from "easy-peasy";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";

function AnnouncementSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return CheckCircle2;
    case "expired":
      return AlertCircle;
    default:
      return Clock;
  }
};

export default function StudentAnnouncementsPage() {
  const { announcements, loading } = useStoreState((state) => state.student);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "Invalid date";
    }
  };

  const isAnnouncementActive = (announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.start_date);
    const endDate = new Date(announcement.end_date);

    return (
      now >= startDate && now <= endDate && announcement.status === "active"
    );
  };

  const isAnnouncementUpcoming = (announcement) => {
    const now = new Date();
    const startDate = new Date(announcement.start_date);

    return now < startDate && announcement.status === "scheduled";
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Stay updated with course announcements and important information
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <AnnouncementSkeleton key={index} />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No announcements yet
              </h3>
              <p className="text-muted-foreground">
                Check back later for course announcements and updates from your
                instructors.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const StatusIcon = getStatusIcon(announcement.status);
              const isActive = isAnnouncementActive(announcement);
              const isUpcoming = isAnnouncementUpcoming(announcement);

              return (
                <Card
                  key={announcement.id}
                  className={`${isActive ? "ring-2 ring-primary/20" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          {announcement.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getAnnouncementStatusBadge(announcement.status)}
                      </div>
                    </div>
                  </CardHeader>

                  {(announcement.description ||
                    announcement.attachment_url) && (
                    <CardContent className="space-y-4">
                      {announcement.description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {announcement.description}
                        </p>
                      )}

                      {announcement.attachment_url && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(announcement.attachment_url, "_blank")
                            }
                            className="flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            View Attachment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}
