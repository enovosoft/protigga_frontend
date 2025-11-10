import DropDownWithSearch from "@/components/shared/DropDownWithSearch";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreState } from "easy-peasy";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const liveClassSchema = z
  .object({
    title: z
      .string("Please enter a title")
      .min(1, "Title is required")
      .max(200, "Title cannot exceed 200 characters"),
    description: z
      .string("Please enter a description")
      .min(1, "Description is required")
      .max(1000, "Description cannot exceed 1000 characters"),
    course_id: z
      .string("Please select a course")
      .min(1, "Please select a course"),
    teacher_name: z
      .string("Please enter a teacher name")
      .min(1, "Teacher name is required")
      .max(100, "Teacher name cannot exceed 100 characters"),
    start_time: z
      .string("Please enter a start time")
      .min(1, "Start time is required"),
    end_time: z
      .string("Please enter an end time")
      .min(1, "End time is required"),
    meeting_id: z
      .string("Please enter a meeting ID")
      .min(1, "Meeting ID is required")
      .max(50, "Meeting ID cannot exceed 50 characters"),
    meeting_password: z
      .string("Please enter a meeting password")
      .min(1, "Meeting password is required")
      .max(50, "Meeting password cannot exceed 50 characters"),
    join_url: z
      .string("Please enter a join URL")
      .url("Please enter a valid URL")
      .min(1, "Join URL is required"),
  })
  .refine(
    (data) => {
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      return endTime > startTime;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export default function LiveClassDialog({
  open,
  onOpenChange,
  liveClass,
  onSave,
  isLoading,
}) {
  // Get courses from admin store
  const courses = useStoreState((state) => state.admin.courses);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: "",
      description: "",
      course_id: "",
      teacher_name: "",
      start_time: "",
      end_time: "",
      meeting_id: "",
      meeting_password: "",
      join_url: "",
    },
  });

  useEffect(() => {
    if (liveClass) {
      // Editing existing live class
      setValue("title", liveClass.title);
      setValue("description", liveClass.description);
      setValue("course_id", liveClass.course_id);
      setValue("teacher_name", liveClass.teacher_name);
      setValue("meeting_id", liveClass.meeting_id);
      setValue("meeting_password", liveClass.meeting_password);
      setValue("join_url", liveClass.join_url);

      if (liveClass.start_time) {
        const startTime = new Date(liveClass.start_time);
        const formattedStartTime = startTime.toISOString().slice(0, 16);
        setValue("start_time", formattedStartTime);
      }

      if (liveClass.end_time) {
        const endTime = new Date(liveClass.end_time);
        const formattedEndTime = endTime.toISOString().slice(0, 16);
        setValue("end_time", formattedEndTime);
      }
    } else {
      // Creating new live class
      reset({
        title: "",
        description: "",
        course_id: "",
        teacher_name: "",
        start_time: "",
        end_time: "",
        meeting_id: "",
        meeting_password: "",
        join_url: "",
      });
    }
  }, [liveClass, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert datetime-local to ISO format
      if (data.start_time) {
        data.start_time = new Date(data.start_time).toISOString();
      }
      if (data.end_time) {
        data.end_time = new Date(data.end_time).toISOString();
      }

      await onSave(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save live class");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {liveClass ? "Edit Live Class" : "Create New Live Class"}
          </DialogTitle>
          <DialogDescription>
            {liveClass
              ? "Update the live class details below."
              : "Fill in the details to create a new live class."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error("Please fix the form errors before submitting");
          })}
          className="space-y-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Introduction to Machine Learning"
              className={cn(
                "transition-colors",
                errors.title && "border-destructive focus:border-destructive"
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="This live class will cover the basics of supervised learning and model evaluation."
              rows={3}
              className={cn(
                "transition-colors resize-none",
                errors.description &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course_id" className="text-sm font-medium">
              Course <span className="text-destructive">*</span>
            </Label>
            <DropDownWithSearch
              items={courses}
              valueKey="course_id"
              displayKey="course_title"
              searchKeys={["course_title", "batch"]}
              displayFormat={(course) =>
                `${course.course_title} - ${course.batch}`
              }
              placeholder="Select a course..."
              selectedValue={watch("course_id")}
              onSelect={(value) => setValue("course_id", value)}
              className={cn(
                "transition-colors",
                errors.course_id &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.course_id && (
              <p className="text-sm text-destructive">
                {errors.course_id.message}
              </p>
            )}
          </div>

          {/* Teacher Name */}
          <div className="space-y-2">
            <Label htmlFor="teacher_name" className="text-sm font-medium">
              Teacher Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="teacher_name"
              {...register("teacher_name")}
              placeholder="Dr. Rafi Ahmed"
              className={cn(
                "transition-colors",
                errors.teacher_name &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.teacher_name && (
              <p className="text-sm text-destructive">
                {errors.teacher_name.message}
              </p>
            )}
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-sm font-medium">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time")}
                className={cn(
                  "transition-colors",
                  errors.start_time &&
                    "border-destructive focus:border-destructive"
                )}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-sm font-medium">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register("end_time")}
                className={cn(
                  "transition-colors",
                  errors.end_time &&
                    "border-destructive focus:border-destructive"
                )}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          {/* Meeting ID & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_id" className="text-sm font-medium">
                Meeting ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="meeting_id"
                {...register("meeting_id")}
                placeholder="9876543210"
                className={cn(
                  "transition-colors",
                  errors.meeting_id &&
                    "border-destructive focus:border-destructive"
                )}
              />
              {errors.meeting_id && (
                <p className="text-sm text-destructive">
                  {errors.meeting_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_password" className="text-sm font-medium">
                Meeting Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="meeting_password"
                {...register("meeting_password")}
                placeholder="mlclass2025"
                className={cn(
                  "transition-colors",
                  errors.meeting_password &&
                    "border-destructive focus:border-destructive"
                )}
              />
              {errors.meeting_password && (
                <p className="text-sm text-destructive">
                  {errors.meeting_password.message}
                </p>
              )}
            </div>
          </div>

          {/* Join URL */}
          <div className="space-y-2">
            <Label htmlFor="join_url" className="text-sm font-medium">
              Join URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="join_url"
              type="url"
              {...register("join_url")}
              placeholder="https://zoom.us/j/9876543210?pwd=mlclass2025"
              className={cn(
                "transition-colors",
                errors.join_url && "border-destructive focus:border-destructive"
              )}
            />
            {errors.join_url && (
              <p className="text-sm text-destructive">
                {errors.join_url.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {liveClass ? "Updating..." : "Creating..."}
                </>
              ) : liveClass ? (
                "Update Live Class"
              ) : (
                "Create Live Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
