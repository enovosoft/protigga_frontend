import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z
    .string()
    .min(11, { message: "Phone number must be 11 digits" })
    .max(11, { message: "Phone number must be 11 digits" })
    .regex(/^01[0-9]{9}$/, { message: "Phone number must start with 01 and be 11 digits" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "Thana/State is required" }),
  district: z.string().min(2, { message: "District is required" }),
  division: z.string().min(1, { message: "Please select a division" }),
});

export const validateCheckoutForm = (data) => {
  const result = checkoutFormSchema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
  return { success: true, data: result.data };
};
