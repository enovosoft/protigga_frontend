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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreState } from "easy-peasy";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const promoSchema = z
  .object({
    promocode_for: z.enum(["all", "book", "course"], {
      required_error: "Please select what this promo is for",
    }),
    book_id: z.string().optional(),
    course_id: z.string().optional(),
    Discount_type: z.enum(["percentage", "fixed"], {
      required_error: "Please select discount type",
    }),
    Discount: z
      .number({
        required_error: "Minimum purchase amount is required",
        invalid_type_error: "Minimum purchase must be a number",
      })
      .min(0, "Minimum purchase cannot be negative"),
    Max_discount_amount: z
      .union([z.string().optional(), z.number().optional()])
      .optional()
      .transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = typeof val === "string" ? parseFloat(val) : val;
        return isNaN(num) ? undefined : num;
      }),
    Min_purchase_amount: z
      .number({
        required_error: "Minimum purchase amount is required",
        invalid_type_error: "Minimum purchase must be a number",
      })
      .min(0, "Minimum purchase cannot be negative"),
    promo_code: z
      .string()
      .min(1, "Promo code is required")
      .max(50, "Promo code cannot exceed 50 characters")
      .regex(
        /^[A-Z0-9_-]+$/i,
        "Promo code can only contain letters, numbers, hyphens, and underscores"
      ),
    expiry_date: z.string().min(1, "Expiry date is required"),
    status: z.enum(["active", "inactive"], {
      required_error: "Please select status",
    }),
  })
  .refine(
    (data) => {
      if (data.promocode_for === "book" && !data.book_id) {
        return false;
      }
      if (data.promocode_for === "course" && !data.course_id) {
        return false;
      }
      return true;
    },
    {
      message:
        "Please select a specific book/course when applicable for is not 'all'",
      path: ["promocode_for"],
    }
  )
  .refine(
    (data) => {
      if (data.Discount_type === "percentage" && data.Discount > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["Discount"],
    }
  )
  .refine(
    (data) => {
      if (data.Discount_type === "fixed") {
        // For fixed discounts, Max_discount_amount should be set to the discount value
        data.Max_discount_amount = parseInt(data.Discount);
        return true;
      }
      // For percentage discounts, Max_discount_amount can be empty
      return true;
    },
    {
      message: "Max discount amount is required for fixed discounts",
      path: ["Max_discount_amount"],
    }
  );

export default function PromoDialog({
  open,
  onOpenChange,
  promo,
  onSave,
  isLoading,
}) {
  // Get courses and books from admin store
  const courses = useStoreState((state) => state.admin.courses);
  const books = useStoreState((state) => state.admin.books);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      promocode_for: "",
      book_id: "",
      course_id: "",
      Discount_type: "",
      Discount: "",
      Max_discount_amount: "",
      Min_purchase_amount: "",
      promo_code: "",
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 1 week from now in YYYY-MM-DD format
      status: "active",
    },
  });

  const discountType = watch("Discount_type");
  const promocodeFor = watch("promocode_for");

  useEffect(() => {
    if (promo) {
      // Editing existing promo
      setValue("promocode_for", promo.promocode_for);
      setValue("book_id", promo.book_id || "");
      setValue("course_id", promo.course_id || "");
      setValue("Discount_type", promo.Discount_type);
      setValue("Discount", promo.Discount);
      setValue("Max_discount_amount", promo.Max_discount_amount || 0);
      setValue("Min_purchase_amount", promo.Min_purchase_amount);
      setValue("promo_code", promo.promo_code);
      setValue("status", promo.status);
      if (promo.expiry_date) {
        const expiryDate = new Date(promo.expiry_date);
        // Convert to YYYY-MM-DD format for HTML date input
        const formattedDate = expiryDate.toISOString().split("T")[0];
        setValue("expiry_date", formattedDate);
      }
    } else {
      // Creating new promo
      reset({
        promocode_for: "",
        book_id: "",
        course_id: "",
        Discount_type: "",
        Discount: "",
        Max_discount_amount: "",
        Min_purchase_amount: "",
        promo_code: "",
        expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 2 months from now in YYYY-MM-DD format
        status: "active",
      });
    }
  }, [promo, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert expiry_date from YYYY-MM-DD to ISO-8601 format
      if (data.expiry_date) {
        data.expiry_date = new Date(
          data.expiry_date + "T23:59:59.000Z"
        ).toISOString();
      }

      await onSave(data);
      onOpenChange(false);
      // Reset form to initial state after successful creation
      if (!promo) {
        reset({
          promocode_for: "",
          book_id: "",
          course_id: "",
          Discount_type: "",
          Discount: "",
          Max_discount_amount: "",
          Min_purchase_amount: "",
          promo_code: "",
          expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 1 week from now in YYYY-MM-DD format
          status: "active",
        });
      }
      toast.success(
        promo ? "Promo updated successfully!" : "Promo created successfully!"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save promo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {promo ? "Edit Promo Code" : "Create New Promo Code"}
          </DialogTitle>
          <DialogDescription>
            {promo
              ? "Update the promo code details below."
              : "Fill in the details to create a new promo code."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Promo Code */}
          <div className="space-y-2">
            <Label htmlFor="promo_code" className="text-sm font-medium">
              Promo Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="promo_code"
              {...register("promo_code")}
              placeholder="SUMMER2024"
              className={cn(
                "transition-colors",
                errors.promo_code &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.promo_code && (
              <p className="text-sm text-destructive">
                {errors.promo_code.message}
              </p>
            )}
          </div>

          {/* For */}
          <div className="space-y-2">
            <Label htmlFor="promocode_for" className="text-sm font-medium">
              Applicable For <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("promocode_for")}
              onValueChange={(value) => setValue("promocode_for", value)}
            >
              <SelectTrigger
                className={cn(
                  "transition-colors",
                  errors.promocode_for &&
                    "border-destructive focus:border-destructive"
                )}
              >
                <SelectValue placeholder="Select what this promo is for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="course">Course</SelectItem>
              </SelectContent>
            </Select>
            {errors.promocode_for && (
              <p className="text-sm text-destructive">
                {errors.promocode_for.message}
              </p>
            )}
          </div>

          {/* Specific Book/Course Selection */}
          {promocodeFor === "book" && (
            <div className="space-y-2">
              <Label htmlFor="book_id" className="text-sm font-medium">
                Select Book <span className="text-destructive">*</span>
              </Label>
              <DropDownWithSearch
                items={books}
                valueKey="book_id"
                displayKey="title"
                searchKeys={["title", "batch"]}
                placeholder="Select a book..."
                selectedValue={watch("book_id")}
                onSelect={(value) => setValue("book_id", value)}
                className={cn(
                  "transition-colors",
                  errors.book_id &&
                    "border-destructive focus:border-destructive"
                )}
                displayFormat={(book) => `${book.title} - ${book.batch}`}
              />
              {errors.book_id && (
                <p className="text-sm text-destructive">
                  {errors.book_id.message}
                </p>
              )}
            </div>
          )}

          {promocodeFor === "course" && (
            <div className="space-y-2">
              <Label htmlFor="course_id" className="text-sm font-medium">
                Select Course <span className="text-destructive">*</span>
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
          )}

          {/* Discount Type */}
          <div className="space-y-2">
            <Label htmlFor="Discount_type" className="text-sm font-medium">
              Discount Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("Discount_type")}
              onValueChange={(value) => setValue("Discount_type", value)}
            >
              <SelectTrigger
                className={cn(
                  "transition-colors",
                  errors.Discount_type &&
                    "border-destructive focus:border-destructive"
                )}
              >
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
              </SelectContent>
            </Select>
            {errors.Discount_type && (
              <p className="text-sm text-destructive">
                {errors.Discount_type.message}
              </p>
            )}
          </div>

          {/* Discount Amount */}
          <div className="space-y-2">
            <Label htmlFor="Discount" className="text-sm font-medium">
              Discount Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="Discount"
              type="number"
              step="1"
              {...register("Discount", { valueAsNumber: true })}
              placeholder={discountType === "percentage" ? "10" : "100"}
              className={cn(
                "transition-colors",
                errors.Discount && "border-destructive focus:border-destructive"
              )}
            />
            {errors.Discount && (
              <p className="text-sm text-destructive">
                {errors.Discount.message}
              </p>
            )}
          </div>

          {/* Max Discount Amount - Only show for percentage */}
          {discountType === "percentage" && (
            <div className="space-y-2">
              <Label
                htmlFor="Max_discount_amount"
                className="text-sm font-medium"
              >
                Max Discount Amount (৳){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="Max_discount_amount"
                type="number"
                step="1"
                {...register("Max_discount_amount")}
                placeholder="500"
                className={cn(
                  "transition-colors",
                  errors.Max_discount_amount &&
                    "border-destructive focus:border-destructive"
                )}
              />
              {errors.Max_discount_amount && (
                <p className="text-sm text-destructive">
                  {errors.Max_discount_amount.message}
                </p>
              )}
            </div>
          )}

          {/* Min Purchase Amount */}
          <div className="space-y-2">
            <Label
              htmlFor="Min_purchase_amount"
              className="text-sm font-medium"
            >
              Minimum Purchase Amount (৳){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="Min_purchase_amount"
              type="number"
              step="1"
              {...register("Min_purchase_amount", { valueAsNumber: true })}
              placeholder="1000"
              className={cn(
                "transition-colors",
                errors.Min_purchase_amount &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.Min_purchase_amount && (
              <p className="text-sm text-destructive">
                {errors.Min_purchase_amount.message}
              </p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Expiry Date <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              {...register("expiry_date")}
              className={cn(
                "transition-colors",
                errors.expiry_date &&
                  "border-destructive focus:border-destructive"
              )}
            />
            {errors.expiry_date && (
              <p className="text-sm text-destructive">
                {errors.expiry_date.message}
              </p>
            )}
          </div>

          {/* Status - Only show when editing */}
          {promo && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger
                  className={cn(
                    "transition-colors",
                    errors.status &&
                      "border-destructive focus:border-destructive"
                  )}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : promo
                ? "Update Promo"
                : "Create Promo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
