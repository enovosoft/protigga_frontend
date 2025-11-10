import Loading from "@/components/shared/Loading";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { differenceInMinutes, format } from "date-fns";
import { useStoreState } from "easy-peasy";
import {
  AlertTriangle,
  Book,
  Calendar,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  GraduationCap,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { loading, exams, liveClasses } = useStoreState(
    (state) => state.student
  );

  // Helper function to format duration in HH:MM format
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")} hrs`;
    }
    return `${mins} min`;
  };

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
      title: "Announcements",
      description: "View course announcements and important updates.",
      icon: MessageSquare,
      onClick: () => navigate("/dashboard/announcements"),
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

            {/* Ongoing Exam Notification */}
            {ongoingExams.length > 0 && (
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

            {/* Live Classes Section */}
            {liveClasses && liveClasses.length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary rounded-lg shadow-md">
                        <PlayCircle className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          Live Classes
                        </h3>
                        <p className="text-muted-foreground">
                          Join your Live sessions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveClasses.map((liveClass) => {
                      const startTime = new Date(liveClass.start_time);
                      const endTime = new Date(liveClass.end_time);
                      const now = new Date();
                      const isOngoing = now >= startTime && now <= endTime;
                      const isUpcoming = now < startTime;
                      const duration = differenceInMinutes(endTime, startTime);

                      const copyToClipboard = async (text, label) => {
                        try {
                          await navigator.clipboard.writeText(text);
                          toast.success(`${label} copied to clipboard!`);
                        } catch {
                          toast.error("Failed to copy to clipboard");
                        }
                      };

                      return (
                        <div
                          key={liveClass.live_class_id}
                          className={`group relative bg-card border rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                            isOngoing
                              ? "ring-2 ring-success shadow-success/20 bg-success/5"
                              : isUpcoming
                              ? "hover:border-primary/50"
                              : "opacity-75"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                                  {liveClass.title}
                                </h4>
                                {isOngoing && (
                                  <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full animate-pulse">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground font-medium">
                                  {liveClass.teacher_name}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {format(startTime, "EEE, MMM d, yyyy")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                              <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  {format(startTime, "h:mm a")} -{" "}
                                  {format(endTime, "h:mm a")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDuration(duration)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant={isOngoing ? "success" : "default"}
                                size="sm"
                                className={`w-full transition-all duration-200 ${
                                  isOngoing
                                    ? "hover:bg-success/90 shadow-md hover:shadow-lg"
                                    : "hover:shadow-md"
                                }`}
                              >
                                {isOngoing ? (
                                  <>
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    Join Live Class
                                  </>
                                ) : isUpcoming ? (
                                  <>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Details
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 mr-2" />
                                    View Recording
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      isOngoing
                                        ? "bg-success text-success-foreground"
                                        : "bg-primary text-primary-foreground"
                                    }`}
                                  >
                                    <PlayCircle className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {liveClass.title}
                                      {isOngoing && (
                                        <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                                          LIVE
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </DialogTitle>
                                <DialogDescription>
                                  Live class details and meeting information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Teacher
                                    </label>
                                    <p className="text-sm font-medium">
                                      {liveClass.teacher_name}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Duration
                                    </label>
                                    <p className="text-sm font-medium">
                                      {formatDuration(duration)}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Description
                                  </label>
                                  <p className="text-sm">
                                    {liveClass.description}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Date
                                    </label>
                                    <p className="text-sm font-medium">
                                      {format(startTime, "EEEE, MMMM d, yyyy")}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Time
                                    </label>
                                    <p className="text-sm font-medium">
                                      {format(startTime, "h:mm a")}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Meeting ID
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono bg-muted p-2 rounded flex-1">
                                      {liveClass.meeting_id}
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          liveClass.meeting_id,
                                          "Meeting ID"
                                        )
                                      }
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Meeting Password
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono bg-muted p-2 rounded flex-1">
                                      {liveClass.meeting_password}
                                    </p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          liveClass.meeting_password,
                                          "Meeting Password"
                                        )
                                      }
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <Button
                                  className={`w-full ${
                                    isOngoing
                                      ? "bg-success hover:bg-success/90 text-success-foreground"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    window.open(liveClass.join_url, "_blank")
                                  }
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {isOngoing
                                    ? "Join Live Class"
                                    : "Open Class Link"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      );
                    })}
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
