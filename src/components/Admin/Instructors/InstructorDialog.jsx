import FileUpload from "@/components/shared/FileUpload";
import ImageFallback from "@/components/shared/ImageFallback";
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
import api from "@/lib/api";
import { Loader2, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const instructorSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),
  designation: z
    .string("Designation is required")
    .min(2, "Designation must be at least 2 characters long")
    .max(100, "Designation must be at most 100 characters long"),
  teaching_experience: z
    .string("Teaching experience is required")
    .min(2, "Teaching experience must be at least 2 characters long")
    .max(50, "Teaching experience must be at most 50 characters long"),
  student_count: z
    .string("Student count is required")
    .min(1, "Student count must be at least 1 character long")
    .max(20, "Student count must be at most 20 characters long"),
  academy: z
    .string("Academy is required")
    .min(2, "Academy must be at least 2 characters long")
    .max(100, "Academy must be at most 100 characters long"),
  image: z.string("Image is required").url("Image must be a valid URL"),
});

const initialFormData = {
  name: "",
  designation: "",
  teaching_experience: "",
  student_count: "",
  academy: "",
  image: "",
};

export default function InstructorDialog({
  open,
  onOpenChange,
  instructor,
  onSuccess,
}) {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchInstructorDetails = useCallback(async () => {
    if (!instructor?.instractor_id) return;

    try {
      // For edit mode, we can use the passed instructor data directly
      // since it's already available from the table
      setFormData({
        name: instructor.name || "",
        designation: instructor.designation || "",
        teaching_experience: instructor.teaching_experience || "",
        student_count: instructor.student_count || "",
        academy: instructor.academy || "",
        image: instructor.image || "",
      });
    } catch (error) {
      console.error("Error setting instructor details:", error);
      toast.error("Failed to load instructor details");
    }
  }, [instructor]);

  useEffect(() => {
    if (open) {
      if (instructor) {
        fetchInstructorDetails();
      } else {
        setFormData({ ...initialFormData });
        setErrors({});
      }
    }
  }, [open, instructor, fetchInstructorDetails]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFileUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
    if (errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: undefined,
      }));
    }
  };

  const validateForm = () => {
    try {
      instructorSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      error.errors.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      if (instructor) {
        // Update instructor
        await api.put("/instractor", {
          instractor_id: instructor.instractor_id,
          ...formData,
        });
      } else {
        // Add new instructor
        await api.post("/instractor", formData);
      }

      toast.success(
        instructor
          ? "Instructor updated successfully!"
          : "Instructor added successfully!"
      );

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving instructor:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${instructor ? "update" : "add"} instructor`
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {instructor ? "Edit Instructor" : "Add New Instructor"}
          </DialogTitle>
          <DialogDescription>
            {instructor
              ? "Update the instructor information below."
              : "Fill in the details to add a new instructor."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Profile Image <span className="text-red-500">*</span>
            </Label>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative flex-shrink-0">
                {formData.image ? (
                  <ImageFallback
                    src={formData.image}
                    alt="Instructor"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <FileUpload
                  onUploadSuccess={handleFileUpload}
                  currentFile={formData.image}
                  accept="image/*"
                  supportedTypes="JPG, PNG, WebP, SVG"
                  maxSize={5}
                  placeholder="Upload instructor profile image"
                />
                {errors.image && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.image}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter instructor's full name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation">
              Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              placeholder="e.g., Senior Instructor, Professor"
              className={errors.designation ? "border-destructive" : ""}
            />
            {errors.designation && (
              <p className="text-sm text-destructive">{errors.designation}</p>
            )}
          </div>

          {/* Teaching Experience */}
          <div className="space-y-2">
            <Label htmlFor="teaching_experience">
              Teaching Experience <span className="text-red-500">*</span>
            </Label>
            <Input
              id="teaching_experience"
              value={formData.teaching_experience}
              onChange={(e) =>
                handleInputChange("teaching_experience", e.target.value)
              }
              placeholder="e.g., 5 years, 10+ years"
              className={errors.teaching_experience ? "border-destructive" : ""}
            />
            {errors.teaching_experience && (
              <p className="text-sm text-destructive">
                {errors.teaching_experience}
              </p>
            )}
          </div>

          {/* Student Count */}
          <div className="space-y-2">
            <Label htmlFor="student_count">
              Student Count <span className="text-red-500">*</span>
            </Label>
            <Input
              id="student_count"
              value={formData.student_count}
              onChange={(e) =>
                handleInputChange("student_count", e.target.value)
              }
              placeholder="e.g., 1200+, 500+"
              className={errors.student_count ? "border-destructive" : ""}
            />
            {errors.student_count && (
              <p className="text-sm text-destructive">{errors.student_count}</p>
            )}
          </div>

          {/* Academy */}
          <div className="space-y-2">
            <Label htmlFor="academy">
              Academy/Institution <span className="text-red-500">*</span>
            </Label>
            <Input
              id="academy"
              value={formData.academy}
              onChange={(e) => handleInputChange("academy", e.target.value)}
              placeholder="e.g., Skill Mastery Academy, BUET"
              className={errors.academy ? "border-destructive" : ""}
            />
            {errors.academy && (
              <p className="text-sm text-destructive">{errors.academy}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {instructor ? "Updating..." : "Adding..."}
                </>
              ) : instructor ? (
                "Update Instructor"
              ) : (
                "Add Instructor"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
