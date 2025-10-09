import FileUpload from "@/components/shared/FileUpload";
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
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { BookOpen, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CourseDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    batch: "",
    course_title: "",
    price: "",
    thumbnail: "",
    academy_name: "",
    description: "",
    related_book: "",
    quiz_count: "",
    assessment: false,
    skill_level: "",
    expired_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(false);

  const fetchCourseDetails = useCallback(async () => {
    if (!course?.slug) return;

    setFetchingCourse(true);
    try {
      const response = await api.get(`/course/${course.slug}`);
      if (response.data.success && response.data.course) {
        const courseData = response.data.course;
        setFormData({
          batch: courseData.batch || "",
          course_title: courseData.course_title || "",
          price: courseData.price || "",
          thumbnail: courseData.thumbnail || "",
          academy_name: courseData.course_details?.academy_name || "",
          description: courseData.course_details?.description || "",
          related_book: courseData.related_book || "",
          quiz_count: courseData.course_details?.quiz_count || "",
          assessment: courseData.course_details?.assessment || false,
          skill_level: courseData.course_details?.skill_level || "",
          expired_date: courseData.course_details?.expired_date
            ? new Date(courseData.course_details.expired_date)
                .toISOString()
                .split("T")[0]
            : "",
        });
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to fetch course details");
      // Fallback to the passed course data
      setFormData({
        batch: course.batch || "",
        course_title: course.course_title || "",
        price: course.price || "",
        thumbnail: course.thumbnail || "",
        academy_name: course.academy_name || "",
        description: course.description || "",
        related_book: course.related_book || "",
        quiz_count: course.quiz_count || "",
        assessment: course.assessment || false,
        skill_level: course.skill_level || "",
        expired_date: course.expired_date
          ? new Date(course.expired_date).toISOString().split("T")[0]
          : "",
      });
    } finally {
      setFetchingCourse(false);
    }
  }, [course]);

  // Fetch course details when editing
  useEffect(() => {
    if (course && open) {
      fetchCourseDetails();
    } else if (!course) {
      setFormData({
        batch: "",
        course_title: "",
        price: "",
        thumbnail: "",
        academy_name: "",
        description: "",
        related_book: "",
        quiz_count: "",
        assessment: false,
        skill_level: "",
        expired_date: "",
      });
    }
  }, [course, open, fetchCourseDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.course_title.trim()) {
      toast.error("Course title is required");
      return;
    }
    if (!formData.batch.trim()) {
      toast.error("Batch is required");
      return;
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.thumbnail.trim()) {
      toast.error("Please upload a thumbnail");
      return;
    }
    if (!formData.academy_name.trim()) {
      toast.error("Academy name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.skill_level) {
      toast.error("Skill level is required");
      return;
    }
    if (!formData.expired_date) {
      toast.error("Expired date is required");
      return;
    }

    setLoading(true);

    try {
      let response;

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quiz_count: parseInt(formData.quiz_count) || 0,
        expired_date: new Date(formData.expired_date).toISOString(),
      };

      if (course) {
        // Update existing course
        response = await api.put("/course", {
          ...payload,
          course_id: course.course_id,
          slug: course.slug,
        });
      } else {
        // Create new course
        response = await api.post("/course", payload);
      }

      if (response.data.success) {
        toast.success(
          course
            ? "Course updated successfully!"
            : "Course created successfully!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Course operation error:", error);
      toast.error(error.response?.data?.message || "Failed to save course");
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
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <DialogTitle className="text-base sm:text-xl truncate">
                  {course ? "Edit Course" : "Add New Course"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm truncate">
                  {course
                    ? "Update the course details below."
                    : "Fill in the details to add a new course."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {fetchingCourse ? (
            <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden">
              {/* Skeleton for title and batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
              </div>

              {/* Skeleton for price and academy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
              </div>

              {/* Skeleton for description */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 sm:h-24 w-full" />
              </div>

              {/* Skeleton for file upload */}
              <div className="overflow-hidden p-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden"
            >
              {/* Show existing thumbnail when editing */}
              {course && course.thumbnail && (
                <div className="p-2.5 sm:p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden w-full">
                  <Label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">
                    Current Thumbnail:
                  </Label>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="overflow-hidden w-full">
                      <a
                        href={course.thumbnail}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-primary hover:underline break-words block w-full overflow-hidden"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {course.thumbnail}
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                    Upload a new thumbnail below to replace the current one
                  </p>
                </div>
              )}

              {/* Title and Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="course_title" className="text-sm font-medium">
                    Course Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="course_title"
                    name="course_title"
                    value={formData.course_title}
                    onChange={handleChange}
                    placeholder="Final Revision Batch"
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="batch" className="text-sm font-medium">
                    Batch <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="HSC 26"
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>
              </div>

              {/* Price and Academy Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price (BDT) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1200"
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="academy_name" className="text-sm font-medium">
                    Academy Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="academy_name"
                    name="academy_name"
                    value={formData.academy_name}
                    onChange={handleChange}
                    placeholder="Protigga Academy"
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>
              </div>

              {/* Skill Level and Quiz Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="skill_level" className="text-sm font-medium">
                    Skill Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.skill_level}
                    onValueChange={(value) =>
                      handleSelectChange("skill_level", value)
                    }
                  >
                    <SelectTrigger className="w-full h-10 sm:h-11">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="quiz_count" className="text-sm font-medium">
                    Quiz Count
                  </Label>
                  <Input
                    id="quiz_count"
                    name="quiz_count"
                    type="number"
                    min="0"
                    value={formData.quiz_count}
                    onChange={handleChange}
                    placeholder="10"
                    className="w-full h-10 sm:h-11"
                  />
                </div>
              </div>

              {/* Expired Date and Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="expired_date" className="text-sm font-medium">
                    Expired Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="expired_date"
                    name="expired_date"
                    type="date"
                    value={formData.expired_date}
                    onChange={handleChange}
                    required
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-sm font-medium">Assessment</Label>
                  <div className="flex items-center space-x-2 h-10 sm:h-11">
                    <input
                      type="checkbox"
                      id="assessment"
                      name="assessment"
                      checked={formData.assessment}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="assessment" className="text-sm">
                      Has Assessment
                    </Label>
                  </div>
                </div>
              </div>

              {/* Related Book */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="related_book" className="text-sm font-medium">
                  Related Book
                </Label>
                <Input
                  id="related_book"
                  name="related_book"
                  value={formData.related_book}
                  onChange={handleChange}
                  placeholder="C Programming for Beginners by M.S. Samad"
                  className="w-full h-10 sm:h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="This course introduces the basics of programming using C language, covering fundamental concepts and hands-on exercises."
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-solid border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="overflow-hidden p-1">
                <FileUpload
                  label={
                    <span>
                      Upload Thumbnail{" "}
                      <span className="text-destructive">*</span>
                    </span>
                  }
                  accept=".jpg,.jpeg,.png,.webp"
                  supportedTypes="Images"
                  autoUpload={true}
                  onUploadSuccess={handleImageUpload}
                />
              </div>

              {formData.thumbnail && (
                <Input
                  type="hidden"
                  name="thumbnail"
                  value={formData.thumbnail}
                />
              )}

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
                      {course ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{course ? "Update Course" : "Create Course"}</>
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
