import ImageFallback from "@/components/shared/ImageFallback";
import Loading from "@/components/shared/Loading";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getAnnouncementStatusBadge } from "@/lib/badgeUtils";
import { differenceInMinutes, format } from "date-fns";
import { useStoreState } from "easy-peasy";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Book,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  PlayCircle,
  User,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const {
    loading,

    liveClasses,
    exams,
    announcements,
  } = useStoreState((state) => state.student);

  // Copy to clipboard function
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

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

  const activeAnnouncements = announcements?.filter(isAnnouncementActive) || [];
  const activeAnnouncementsCount = activeAnnouncements.length;

  // Check for ongoing exams
  const ongoingExams =
    exams?.filter((exam) => {
      const now = new Date();
      const startTime = new Date(exam.exam_start_time);
      const endTime = new Date(exam.exam_end_time);
      return now >= startTime && now <= endTime;
    }) || [];
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
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
                <p className="text-muted-foreground">
                  Welcome to your learning dashboard.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative shrink-0 rounded-full w-12 h-12 shadow-sm hover:shadow-md hover:bg-primary/5 transition-all border-primary/20 ml-auto"
                  >
                    <Bell className="h-6 w-6 text-primary" />
                    {activeAnnouncementsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center rounded-full p-0 text-xs border-2 border-background animate-pulse "
                      >
                        {activeAnnouncementsCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <MessageSquare className="w-6 h-6 text-primary" />
                      Announcements
                    </DialogTitle>
                    <DialogDescription>
                      Stay updated with the latest news and notices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="space-y-4 py-4">
                      {activeAnnouncements.length > 0 ? (
                        activeAnnouncements.map((announcement) => {
                          const StatusIcon = getStatusIcon(announcement.status);
                          return (
                            <Card
                              key={announcement.id}
                              className="transition-all duration-200 hover:shadow-md ring-1 ring-border/50"
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                    <StatusIcon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="min-w-0">
                                        <h4 className="font-bold text-lg text-foreground truncate">
                                          {announcement.title}
                                        </h4>
                                      </div>
                                      <div className="shrink-0">
                                        {getAnnouncementStatusBadge(
                                          announcement.status
                                        )}
                                      </div>
                                    </div>
                                    {announcement.description && (
                                      <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {announcement.description}
                                      </div>
                                    )}
                                    {announcement.attachment_url && (
                                      <div className="mt-4 bg-muted/30 p-2 rounded-lg border border-border/50 inline-block">
                                        <ImageFallback
                                          src={announcement.attachment_url}
                                          alt="Announcement Attachment"
                                          className="max-h-64 w-auto object-contain rounded shadow-sm"
                                        />
                                      </div>
                                    )}
                                    {announcement.course_title && (
                                      <p className="text-xs text-muted-foreground mt-1 truncate">
                                        Course:{" "}
                                        <span className="font-medium">
                                          {announcement.course_title}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground ">
                          <div className="p-4 bg-muted rounded-full mb-4">
                            <Bell className="w-8 h-8 opacity-50" />
                          </div>
                          <p className="text-lg font-medium">
                            No active announcements
                          </p>
                          <p className="text-sm">
                            Check back later for updates.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Live Classes Section */}
            {liveClasses && liveClasses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Live Classes
                </h3>
                <div className="space-y-3">
                  {liveClasses.map((liveClass) => {
                    const startTime = new Date(liveClass.start_time);
                    const endTime = new Date(liveClass.end_time);
                    const now = new Date();
                    const isOngoing = now >= startTime && now <= endTime;
                    const isUpcoming = now < startTime;
                    const duration = differenceInMinutes(endTime, startTime);
                    const courseAnnouncementsCount =
                      announcements?.filter(
                        (a) =>
                          a.course_id === liveClass.course_id &&
                          isAnnouncementActive(a)
                      ).length || 0;

                    return (
                      <Card
                        key={liveClass.id}
                        className={`transition-all duration-200 hover:shadow-md relative ${
                          isOngoing
                            ? "ring-2 ring-green-500/30 bg-green-50"
                            : isUpcoming
                            ? "ring-2 ring-blue-500/30 bg-blue-50"
                            : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div
                                className={`p-2 rounded-lg ${
                                  isOngoing
                                    ? "bg-green-500 text-white animate-pulse"
                                    : isUpcoming
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-500 text-white"
                                }`}
                              >
                                <Video className="w-4 h-4" />
                              </div>

                              {/* Course specific announcements bell overlay */}
                              {announcements && (
                                <div className="absolute top-2 -right-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="shrink-0 w-8 h-8 rounded-full bg-background/80 backdrop-blur"
                                      >
                                        <Bell className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    {courseAnnouncementsCount > 0 && (
                                      <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs border-2 border-background"
                                      >
                                        {courseAnnouncementsCount}
                                      </Badge>
                                    )}
                                    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                          <Bell className="w-5 h-5 text-primary" />
                                          Announcements -{" "}
                                          {liveClass.course_title}
                                        </DialogTitle>
                                        <DialogDescription>
                                          Latest announcements for this course
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                                        <div className="space-y-4 py-4">
                                          {announcements
                                            .filter(
                                              (a) =>
                                                a.course_id ===
                                                liveClass.course_id
                                            )
                                            .filter(isAnnouncementActive)
                                            .map((announcement) => {
                                              const StatusIcon = getStatusIcon(
                                                announcement.status
                                              );
                                              return (
                                                <Card
                                                  key={announcement.id}
                                                  className="transition-all duration-200 hover:shadow-md ring-1 ring-border/50"
                                                >
                                                  <CardContent className="p-5">
                                                    <div className="flex items-start gap-4">
                                                      <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                                        <StatusIcon className="w-5 h-5 text-primary" />
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                          <h4 className="font-bold text-lg text-foreground">
                                                            {announcement.title}
                                                          </h4>
                                                          <div className="shrink-0">
                                                            {getAnnouncementStatusBadge(
                                                              announcement.status
                                                            )}
                                                          </div>
                                                        </div>
                                                        {announcement.description && (
                                                          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                            {
                                                              announcement.description
                                                            }
                                                          </div>
                                                        )}

                                                        {announcement.attachment_url && (
                                                          <ImageFallback
                                                            src={
                                                              announcement.attachment_url
                                                            }
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
                                          {announcements.filter(
                                            (a) =>
                                              a.course_id ===
                                                liveClass.course_id &&
                                              isAnnouncementActive(a)
                                          ).length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground ">
                                              <div className="p-4 bg-muted rounded-full mb-4">
                                                <Bell className="w-8 h-8 opacity-50" />
                                              </div>
                                              <p className="text-lg font-medium">
                                                No active announcements for this
                                                course
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-foreground truncate">
                                  {liveClass.title}
                                </h4>
                                <div className="flex gap-2">
                                  {isOngoing && (
                                    <Badge className="bg-green-500 text-white">
                                      <div className="size-1.5 bg-red-400 animate-pulse rounded-full"></div>
                                      Live Now
                                    </Badge>
                                  )}
                                  {isUpcoming && (
                                    <Badge variant="secondary">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Upcoming
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(startTime, "MMM dd, h:mm a")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(duration)}
                                </span>
                              </div>
                              {liveClass.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {liveClass.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-3">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      className={
                                        isOngoing
                                          ? "bg-green-600 hover:bg-green-700"
                                          : ""
                                      }
                                    >
                                      <PlayCircle className="w-4 h-4 mr-2" />
                                      Join Class
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Video className="w-5 h-5" />
                                        {liveClass.title}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Class details and join information
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">
                                            Start Time:
                                          </span>
                                          <p className="font-medium">
                                            {format(startTime, "MMM dd, yyyy")}
                                            <br />
                                            {format(startTime, "h:mm a")}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Duration:
                                          </span>
                                          <p className="font-medium">
                                            {formatDuration(duration)}
                                          </p>
                                        </div>
                                      </div>
                                      {liveClass.description && (
                                        <div>
                                          <span className="text-muted-foreground text-sm">
                                            Description:
                                          </span>
                                          <p className="text-sm mt-1">
                                            {liveClass.description}
                                          </p>
                                        </div>
                                      )}
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">
                                            Meeting ID:
                                          </span>
                                          <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                                            {liveClass.meeting_id}
                                          </code>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              copyToClipboard(
                                                liveClass.meeting_id,
                                                "Meeting ID"
                                              )
                                            }
                                          >
                                            <Copy className="w-3 h-3" />
                                          </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">
                                            Password:
                                          </span>
                                          <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                                            {liveClass.meeting_password}
                                          </code>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              copyToClipboard(
                                                liveClass.meeting_password,
                                                "Meeting Password"
                                              )
                                            }
                                          >
                                            <Copy className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          className="flex-1"
                                          onClick={() =>
                                            window.open(
                                              liveClass.meeting_link ||
                                                liveClass.join_url,
                                              "_blank"
                                            )
                                          }
                                        >
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          Join Meeting
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                {/* Right-side duplicate bell removed - bell overlay on left icon now handles course announcements */}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Ongoing Exam Notification */}
            {ongoingExams && ongoingExams.length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800">
                      Ongoing Exam{ongoingExams.length > 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-yellow-700">
                      You have {ongoingExams.length} exam
                      {ongoingExams.length > 1 ? "s" : ""} currently in
                      progress.
                      <button
                        onClick={() => navigate("/dashboard/exams")}
                        className="ml-2 text-yellow-800 underline hover:text-yellow-900 font-medium"
                      >
                        View Exam{ongoingExams.length > 1 ? "s" : ""}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}
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
