import DropDownWithSearch from "@/components/shared/DropDownWithSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useStoreState } from "easy-peasy";
import { CalendarIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const manualEnrollmentSchema = z.object({
  enrollment_type: z.enum(["hybrid", "online"], {
    required_error: "Enrollment type is required",
  }),
  phone: z
    .string()
    .regex(
      /^\+8801\d{9}$/,
      "Phone must be a valid Bangladesh number (+8801xxxxxxxx)"
    ),
  course_id: z.string().min(1, "Course selection is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  product_price: z.number().min(0, "Price must be positive"),
  discount_amount: z.number().min(0, "Discount must be positive").default(0),
  fb_name: z.string().min(1, "Facebook profile name is required"),
  wp_number: z
    .string()
    .regex(
      /^\+8801\d{9}$/,
      "WhatsApp must be a valid Bangladesh number (+8801xxxxxxxx)"
    ),
  paid_amount: z.number().min(0, "Paid amount must be positive"),
  payment_status: z.enum([
    "PENDING",
    "SUCCESS",
    "FAILED",
    "REFUNDED",
    "CANCELLED",
  ]),
  enrollment_status: z.enum([
    "pending",
    "failed",
    "success",
    "cancelled",
    "refunded",
  ]),
  remarks: z.string().optional(),
  method: z.enum([
    "BKASH",
    "NAGAD",
    "STRIPE",
    "SSL_COMMERZ",
    "CASH",
    "OTHER",
    "BANK",
  ]),
});

export default function ManualEnrollmentDialog({ onEnrollmentCreated }) {
  const [open, setOpen] = useState(false);
  const courses = useStoreState((state) => state.admin.courses);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(manualEnrollmentSchema),
    defaultValues: {
      enrollment_type: "online",
      phone: "",
      course_id: "",
      expiry_date: (() => {
        const ThreeMonthFromNow = new Date();
        ThreeMonthFromNow.setDate(ThreeMonthFromNow.getDate() + 90);
        return ThreeMonthFromNow.toISOString();
      })(),
      product_price: 0,
      discount_amount: 0,
      fb_name: "",
      wp_number: "",
      paid_amount: 0,
      payment_status: "SUCCESS",
      enrollment_status: "success",
      remarks: "",
      method: "BKASH",
    },
  });

  // Update product price when course changes
  const watchedCourseId = form.watch("course_id");

  useEffect(() => {
    if (watchedCourseId && courses.length > 0) {
      const selectedCourse = courses.find(
        (course) => course.course_id === watchedCourseId
      );
      if (selectedCourse && selectedCourse.price) {
        form.setValue("product_price", selectedCourse.price);
      }
    }
  }, [watchedCourseId, courses, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/manual/enrollment", data);
      if (response.data.success) {
        toast.success("Manual enrollment created successfully");
        setOpen(false);
        form.reset();
        if (onEnrollmentCreated) {
          onEnrollmentCreated();
        }
      } else {
        toast.error(
          response.data.message || "Failed to create manual enrollment"
        );
      }
    } catch (error) {
      console.error("Error creating manual enrollment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create manual enrollment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Manual Enrollment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Enrollment</DialogTitle>
          <DialogDescription>
            Manually create a course enrollment with custom details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+8801xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enrollment Type */}
              <FormField
                control={form.control}
                name="enrollment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enrollment Type{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select enrollment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Course Selection */}
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Course <span className="text-destructive">*</span>
                    </FormLabel>
                    <DropDownWithSearch
                      items={courses}
                      valueKey="course_id"
                      displayFormat={(item) =>
                        `${item.course_title} (${item.batch})`
                      }
                      searchKeys={["course_title", "batch"]}
                      selectedValue={field.value}
                      onSelect={field.onChange}
                      placeholder="Select a course"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiry Date */}
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expiry Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Price */}
              <FormField
                control={form.control}
                name="product_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Price <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount Amount */}
              <FormField
                control={form.control}
                name="discount_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FB Name */}
              <FormField
                control={form.control}
                name="fb_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Facebook Profile Name{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Profile name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WP Number */}
              <FormField
                control={form.control}
                name="wp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      WhatsApp Number{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+8801xxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Paid Amount */}
              <FormField
                control={form.control}
                name="paid_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Paid Amount <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status */}
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Enrollment Status */}
              <FormField
                control={form.control}
                name="enrollment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Enrollment Status{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Additional notes or remarks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Method */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Method <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BKASH">bKash</SelectItem>
                      <SelectItem value="NAGAD">Nagad</SelectItem>
                      <SelectItem value="STRIPE">Stripe</SelectItem>
                      <SelectItem value="SSL_COMMERZ">SSL Commerz</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="BANK">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Enrollment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
