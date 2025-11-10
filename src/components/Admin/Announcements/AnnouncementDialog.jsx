import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

import DropDownWithSearch from "@/components/shared/DropDownWithSearch";
import api from "@/lib/api";
import { useStoreState } from "easy-peasy";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const announcementSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or less"),
    description: z.string().optional(),
    course_id: z.string().min(1, "Course selection is required"),
    attachment_url: z.string().optional(),
    status: z.enum(["active", "expired", "draft", "scheduled"], {
      required_error: "Status is required",
    }),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    is_send_sms: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

const updateAnnouncementSchema = announcementSchema.safeExtend({
  announcement_id: z.string().min(1, "Announcement ID is required"),
});
export default function AnnouncementDialog({
  open,
  onOpenChange,
  announcement,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    attachment_url: "",
    status: "draft",
    start_date: "",
    end_date: "",
    is_send_sms: false,
  });
  const courses = useStoreState((state) => state.admin.courses);

  const [loading, setLoading] = useState(false);
  const coursesLoading = useStoreState((state) => state.admin.loading);

  const [errors, setErrors] = useState({});

  // Reset form when dialog opens/closes or announcement changes
  useEffect(() => {
    if (open) {
      if (announcement) {
        // Editing existing announcement
        setFormData({
          title: announcement.title || "",
          description: announcement.description || "",
          course_id: announcement.course_id || "",
          attachment_url: announcement.attachment_url || "",
          status: announcement.status || "draft",
          start_date: announcement.start_date
            ? new Date(announcement.start_date).toISOString().slice(0, 16)
            : "",
          end_date: announcement.end_date
            ? new Date(announcement.end_date).toISOString().slice(0, 16)
            : "",
          is_send_sms: announcement.is_send_sms || false,
        });
      } else {
        // Creating new announcement
        setFormData({
          title: "",
          description: "",
          course_id: "",
          attachment_url: "",
          status: "draft",
          start_date: "",
          end_date: "",
          is_send_sms: false,
        });
      }
      setErrors({});
    }
  }, [announcement, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      is_send_sms: checked,
    }));
  };

  const handleFileUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      attachment_url: url,
    }));
  };

  const validateForm = () => {
    try {
      const schema = announcement
        ? updateAnnouncementSchema
        : announcementSchema;
      const dataToValidate = announcement
        ? { ...formData, announcement_id: announcement.announcement_id }
        : formData;

      schema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      const fieldErrors = {};
      error.issues?.forEach((err) => {
        if (err.path) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert datetime-local format to ISO string for API
      const submitData = {
        ...formData,
        start_date: formData.start_date
          ? new Date(formData.start_date).toISOString()
          : "",
        end_date: formData.end_date
          ? new Date(formData.end_date).toISOString()
          : "",
      };

      let response;
      if (announcement) {
        // Update existing announcement
        const updateData = {
          ...submitData,
          announcement_id: announcement.announcement_id,
        };
        response = await api.put("/announcement", updateData);
      } else {
        // Create new announcement
        response = await api.post("/announcement", submitData);
      }

      if (response.data.success) {
        toast.success(
          announcement
            ? "Announcement updated successfully"
            : "Announcement created successfully"
        );
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error(response.data.message || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save announcement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Edit Announcement" : "Create New Announcement"}
          </DialogTitle>
          <DialogDescription>
            {announcement
              ? "Update the announcement details below."
              : "Fill in the details to create a new announcement."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              maxLength={200}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          {/* Course Selection */}
          <div className="space-y-2">
            <Label>
              Course <span className="text-red-500">*</span>
            </Label>
            {coursesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <DropDownWithSearch
                items={courses}
                valueKey="course_id"
                displayFormat={(item) => `${item.course_title} (${item.batch})`}
                selectedValue={formData.course_id}
                searchKeys={["course_title", "batch"]}
                placeholder="Select a course"
                onSelect={(value) => handleSelectChange("course_id", value)}
              />
            )}
            {errors.course_id && (
              <p className="text-sm text-red-500">{errors.course_id}</p>
            )}
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter announcement description (optional)"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SMS Notification */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms"
              checked={formData.is_send_sms}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="sms" className="text-sm font-medium">
              Send SMS
            </Label>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attachment</Label>
            <FileUpload
              onUploadSuccess={handleFileUpload}
              label="Upload attachment (optional)"
              accept="image/*"
              supportedTypes="Images"
              maxSize={10}
              autoUpload={true}
            />
            {formData.attachment_url && (
              <p className="text-xs text-muted-foreground">
                Current file: {formData.attachment_url}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {announcement ? "Update Announcement" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
