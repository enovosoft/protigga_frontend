import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useStoreState } from "easy-peasy";
import { Calendar, Clock, ExternalLink, Info } from "lucide-react";
import { useState } from "react";

const ExamPage = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const student = useStoreState((s) => s.student);
  const exams = student?.exams || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleStartExam = (examLink) => {
    window.open(examLink, "_blank");
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">My Exams</h2>
          <p className="text-muted-foreground">
            View your upcoming and ongoing exams. Click on an exam to see
            details and start the exam.
          </p>
        </div>

        {exams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
              <p className="text-muted-foreground text-center">
                You don't have any exams scheduled at the moment. Check back
                later for updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const now = new Date();
              const startTime = new Date(exam.exam_start_time);
              const endTime = new Date(exam.exam_end_time);
              const isOngoing = now >= startTime && now <= endTime;
              const isExpired = now > endTime;

              return (
                <Card
                  key={exam.exam_id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    isOngoing
                      ? "border-success bg-success/5"
                      : isExpired
                      ? "border-destructive bg-destructive/5"
                      : "border-primary bg-primary/5"
                  }`}
                  onClick={() => setSelectedExam(exam)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {exam.exam_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Starts:</span>
                        <span className="font-medium">
                          {getRelativeTime(exam.exam_start_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Ends:</span>
                        <span className="font-medium">
                          {getRelativeTime(exam.exam_end_time)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`text-xs font-medium px-2 py-1 rounded-full text-center ${
                        isOngoing
                          ? "bg-success/10 text-success border border-success/20"
                          : isExpired
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {isOngoing
                        ? "Ongoing"
                        : isExpired
                        ? "Expired"
                        : "Upcoming"}
                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExam(exam);
                      }}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Exam Details Dialog */}
        <Dialog
          open={!!selectedExam}
          onOpenChange={() => setSelectedExam(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {selectedExam?.exam_title}
              </DialogTitle>
              <DialogDescription>
                Exam details and schedule information
              </DialogDescription>
            </DialogHeader>

            {selectedExam && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <strong className="text-sm text-muted-foreground">
                        Exam Title
                      </strong>
                      <p className="font-medium">{selectedExam.exam_title}</p>
                    </div>
                    <div>
                      <strong className="text-sm text-muted-foreground">
                        Topic
                      </strong>
                      <p>{selectedExam.exam_topic}</p>
                    </div>
                    <div>
                      <strong className="text-sm text-muted-foreground">
                        Description
                      </strong>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedExam.exam_description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <strong className="text-sm text-muted-foreground">
                        Start Time
                      </strong>
                      <p className="font-medium">
                        {formatDate(selectedExam.exam_start_time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(selectedExam.exam_start_time)}
                      </p>
                    </div>
                    <div>
                      <strong className="text-sm text-muted-foreground">
                        End Time
                      </strong>
                      <p className="font-medium">
                        {formatDate(selectedExam.exam_end_time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(selectedExam.exam_end_time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStartExam(selectedExam.exam_link)}
                    className="flex-1"
                    disabled={new Date() > new Date(selectedExam.exam_end_time)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {new Date() > new Date(selectedExam.exam_end_time)
                      ? "Exam Ended"
                      : "Start Exam"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedExam(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StudentDashboardLayout>
  );
};

export default ExamPage;
