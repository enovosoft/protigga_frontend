import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { FileText, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ExamDialog({ open, onOpenChange, exam, onSuccess }) {
  const [formData, setFormData] = useState({
    course_id: "",
    exam_title: "",
    exam_start_time: "",
    exam_end_time: "",
    exam_topic: "",
    exam_description: "",
    exam_link: "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingExam, setFetchingExam] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Don't show error toast for courses fetch, just keep empty
    }
  }, []);

  const fetchExamDetails = useCallback(async () => {
    if (!exam?.exam_id) return;

    setFetchingExam(true);
    try {
      // Since there's no individual exam fetch endpoint, we'll use the passed exam data
      setFormData({
        course_id: exam.course_id || "",
        exam_title: exam.exam_title || "",
        exam_start_time: exam.exam_start_time
          ? new Date(exam.exam_start_time).toISOString().slice(0, 16)
          : "",
        exam_end_time: exam.exam_end_time
          ? new Date(exam.exam_end_time).toISOString().slice(0, 16)
          : "",
        exam_topic: exam.exam_topic || "",
        exam_description: exam.exam_description || "",
        exam_link: exam.exam_link || "",
      });
    } catch (error) {
      console.error("Error setting exam details:", error);
      toast.error("Failed to load exam details");
    } finally {
      setFetchingExam(false);
    }
  }, [exam]);

  // Fetch courses and exam details when editing
  useEffect(() => {
    if (open) {
      fetchCourses();
      if (exam) {
        fetchExamDetails();
      } else {
        setFormData({
          course_id: "",
          exam_title: "",
          exam_start_time: "",
          exam_end_time: "",
          exam_topic: "",
          exam_description: "",
          exam_link: "",
        });
      }
    }
  }, [exam, open, fetchExamDetails, fetchCourses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.course_id) {
      toast.error("Please select a course");
      return;
    }
    if (!formData.exam_title.trim()) {
      toast.error("Exam title is required");
      return;
    }
    if (!formData.exam_start_time) {
      toast.error("Exam start time is required");
      return;
    }
    if (!formData.exam_end_time) {
      toast.error("Exam end time is required");
      return;
    }
    if (!formData.exam_topic.trim()) {
      toast.error("Exam topic is required");
      return;
    }
    if (!formData.exam_description.trim()) {
      toast.error("Exam description is required");
      return;
    }
    if (!formData.exam_link.trim()) {
      toast.error("Exam link is required");
      return;
    }

    // Check if end time is after start time
    if (
      new Date(formData.exam_end_time) <= new Date(formData.exam_start_time)
    ) {
      toast.error("Exam end time must be after start time");
      return;
    }

    setLoading(true);

    try {
      let response;

      const payload = {
        ...formData,
        exam_start_time: new Date(formData.exam_start_time).toISOString(),
        exam_end_time: new Date(formData.exam_end_time).toISOString(),
      };

      if (exam) {
        // Update existing exam
        response = await api.put("/exam", {
          ...payload,
          exam_id: exam.exam_id,
        });
      } else {
        // Create new exam
        response = await api.post("/exam", payload);
      }

      if (response.data.success) {
        toast.success(
          exam ? "Exam updated successfully!" : "Exam created successfully!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Exam operation error:", error);
      toast.error(error.response?.data?.message || "Failed to save exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-full mx-auto p-0 gap-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] px-4 py-4 sm:px-6 sm:py-6">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <DialogTitle className="text-base sm:text-xl truncate">
                  {exam ? "Edit Exam" : "Add New Exam"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm truncate">
                  {exam
                    ? "Update the exam details below."
                    : "Fill in the details to add a new exam."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {fetchingExam ? (
            <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden">
              {/* Skeleton for form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5 sm:space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-10 sm:h-11 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-20 sm:h-24 bg-muted rounded w-full"></div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden"
            >
              {/* Course Selection */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="course_id" className="text-sm font-medium">
                  Course <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.course_id}
                  onValueChange={(value) =>
                    handleSelectChange("course_id", value)
                  }
                >
                  <SelectTrigger className="w-full h-10 sm:h-11">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <SelectItem
                          key={course.course_id}
                          value={course.course_id}
                        >
                          {course.course_title} ({course.batch})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Title */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="exam_title" className="text-sm font-medium">
                  Exam Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="exam_title"
                  name="exam_title"
                  value={formData.exam_title}
                  onChange={handleChange}
                  placeholder="Midterm Examination"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>

              {/* Start and End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="exam_start_time"
                    className="text-sm font-medium"
                  >
                    Start Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="exam_start_time"
                    name="exam_start_time"
                    type="datetime-local"
                    value={formData.exam_start_time}
                    onChange={handleChange}
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="exam_end_time"
                    className="text-sm font-medium"
                  >
                    End Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="exam_end_time"
                    name="exam_end_time"
                    type="datetime-local"
                    value={formData.exam_end_time}
                    onChange={handleChange}
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>
              </div>

              {/* Exam Topic */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="exam_topic" className="text-sm font-medium">
                  Exam Topic <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="exam_topic"
                  name="exam_topic"
                  value={formData.exam_topic}
                  onChange={handleChange}
                  placeholder="Introduction to Programming"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>

              {/* Exam Link */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="exam_link" className="text-sm font-medium">
                  Exam Link <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="exam_link"
                  name="exam_link"
                  value={formData.exam_link}
                  onChange={handleChange}
                  placeholder="https://example.com/exam/midterm"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>

              {/* Exam Description */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label
                  htmlFor="exam_description"
                  className="text-sm font-medium"
                >
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="exam_description"
                  name="exam_description"
                  value={formData.exam_description}
                  onChange={handleChange}
                  placeholder="This exam will cover basic programming concepts including variables, loops, and functions."
                  required
                  rows={3}
                  className="w-full resize-none min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row pt-2 sm:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {exam ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{exam ? "Update Exam" : "Create Exam"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
