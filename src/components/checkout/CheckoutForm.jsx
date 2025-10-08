import { useAuth } from "@/contexts/AuthContext";
import apiInstance from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import CustomerInformation from "./CustomerInformation";
import OrderSummary from "./OrderSummary";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DELIVERY_OPTIONS,
  PAYMENT_DELIVERY_OPTIONS,
} from "@/config/checkout/data";
import { useCallback } from "react";
import { z } from "zod";

// Zod schema for checkout form validation
const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  phone: z
    .string()
    .regex(/^\+8801[0-9]{9}$/, "Phone number must be in format +8801XXXXXXXXX"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(2, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  city: z
    .string()
    .min(2, "Thana/State is required")
    .max(50, "Thana/State must be less than 50 characters"),
  district: z
    .string()
    .min(2, "District is required")
    .max(50, "District must be less than 50 characters"),
  zipCode: z.string().regex(/^[0-9]{4}$/, "Zip code must be exactly 4 digits"),
  division: z.string().min(1, "Please select a division").optional(),
  deliveryMethod: z.string().optional(),
});

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  address: "",
  district: "",
  division: undefined,
  zipCode: "",
  deliveryMethod: "inside_dhaka",
};

export default function CheckoutForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [productType, setProductType] = useState(null); // "book" or "course"
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [paymentType, setPaymentType] = useState("cod");
  const [deliveryFee, setDeliveryFee] = useState(80); // Default to inside_dhaka price
  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({ ...initialFormData });

  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const bookSlug = searchParams.get("book");

  const isBook = bookSlug && !courseId;

  // Update delivery fee based on payment type and delivery method
  useEffect(() => {
    // Update delivery fee based on payment type and delivery method
    if (isBook) {
      const paymentOption = PAYMENT_DELIVERY_OPTIONS.find(
        (option) => option.value === paymentType
      );

      if (paymentType === "cod") {
        // For COD, delivery fee comes from selected delivery method
        const selectedDeliveryOption = DELIVERY_OPTIONS.find(
          (option) => option.value === formData.deliveryMethod
        );
        setDeliveryFee(selectedDeliveryOption?.price || 80);
      } else if (paymentType === "sundarban") {
        // For Sundarban, fixed delivery charge
        setDeliveryFee(paymentOption?.deliveryCharge || 60);
      } else {
        // For SSL COMMERZ, no delivery charge
        setDeliveryFee(0);
      }
    } else {
      // Courses have no delivery fee
      setDeliveryFee(0);
    }
  }, [paymentType, formData.deliveryMethod, isBook]);
  const fetchProductDetails = useCallback(async () => {
    if (courseId) {
      // Handle course checkout (existing logic)
      try {
        const response = await apiInstance.get(`/courses/${courseId}`);
        if (response.data) {
          const course = response.data;
          setProduct(course);
          setProductType("course");
        } else {
          toast.error("Course not found");
          navigate("/");
          return;
        }
      } catch (error) {
        toast.error("Failed to load course details");
        navigate("/");
        return;
      }
    } else if (bookSlug) {
      // Handle book checkout with proper API structure
      try {
        const response = await apiInstance.get(`/book/${bookSlug}`);
        if (response.data.success && response.data.book) {
          const book = response.data.book;
          setProduct(book);
          setProductType("book");
        } else {
          toast.error("Book not found");
          navigate("/books");
          return;
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load book details"
        );
        navigate("/books");
        return;
      }
    } else {
      toast.error("No product specified");
      navigate("/");
      return;
    }

    setIsLoading(false);
  }, [bookSlug, courseId, navigate]);

  // Check authentication and fetch product details on mount
  useEffect(() => {
    // Check authentication first

    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: {
          message: `Please login first to continue with checkout`,
          variant: "warning",
          successRedirect: location.pathname + location.search,
        },
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      phone: user?.phone || "",
    }));

    fetchProductDetails();
  }, [
    isAuthenticated,
    isAuthLoading,
    fetchProductDetails,
    navigate,
    location,
    user?.name,
    user?.phone,
  ]);

  const checkPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const response = await apiInstance.post("/check-promo-code", {
        promocode: promoCode,
        promocode_for: isBook ? "book" : "course",
      });

      if (response.data.success) {
        const promo = response.data.data;
        const currentSubtotal = calculateSubtotal();

        // Validate minimum purchase amount
        if (
          promo.Min_purchase_amount &&
          currentSubtotal < promo.Min_purchase_amount
        ) {
          toast.error(
            `Minimum order of ৳${promo.Min_purchase_amount} required for this promo code`
          );
          setPromoApplied(false);
          setPromoData(null);
          return;
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.Discount_type === "percentage") {
          discountAmount = (currentSubtotal * promo.Discount) / 100;
        } else {
          discountAmount = promo.Discount;
        }

        // Apply max discount limit
        if (
          promo.Max_discount_amount &&
          discountAmount > promo.Max_discount_amount
        ) {
          discountAmount = promo.Max_discount_amount;
        }

        setPromoData(promo);
        setPromoApplied(true);

        toast.success(`Promo code applied!`);
        return;
      } else {
        toast.error(response.data.message || "Invalid promo code");
        setPromoApplied(false);
        setPromoData(null);
      }
    } catch (error) {
      console.error("Promo code validation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to validate promo code"
      );
      setPromoApplied(false);
      setPromoData(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const calculateSubtotal = () => {
    return (product?.price || 0) * (quantity || 1);
  };

  const calculateDiscount = () => {
    if (!promoApplied || !promoData) return 0;

    let discountAmount = 0;
    if (promoData.Discount_type === "percentage") {
      discountAmount = (calculateSubtotal() * promoData.Discount) / 100;
    } else {
      discountAmount = promoData.Discount;
    }

    // Apply max discount limit
    if (
      promoData.Max_discount_amount &&
      discountAmount > promoData.Max_discount_amount
    ) {
      discountAmount = promoData.Max_discount_amount;
    }

    return discountAmount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + deliveryFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data with Zod
    try {
      checkoutSchema.parse(formData);
      setValidationErrors({}); // Clear any previous errors

      // Prepare data in the format specified by user
      const orderData = {
        meterial_type: product.title ? "book" : "course",
        delevery_type: paymentType === "cod" ? "COD" : "Prepaid",
        inside_dhaka:
          paymentType === "cod" && formData.deliveryMethod === "inside_dhaka",
        outside_dhaka:
          paymentType === "cod" && formData.deliveryMethod === "outside_dhaka",
        sundarban_courier: paymentType === "sundarban",
        customer: {
          name: formData.name,
          email: formData.email || user?.email || "",
          address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.division} - ${formData.zipCode}`,
          alternative_phone: formData.phone,
        },
        meterial_details: {
          product_name:
            productType === "book" ? product.title : product.course_title,
          product_id:
            productType === "book" ? product.book_id : product.course_id,
          user_id: user?.user_id || "",
          quantity: quantity,
          address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.division}, ${formData.zipCode}`,
          alternative_phone: formData.phone,
        },
      };

      if (promoApplied) {
        orderData.meterial_details.promo_code_id = promoData?.promo_code_id;
      }

      setIsLoading(true);
      const response = await apiInstance.post("/payment/init", orderData);
      if (response.data.success) {
        toast.success(response.data?.message || "Order placed successfully!");

        // Check if payment_url exists and redirect
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
          return;
        }
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set validation errors
        const errors = {};
        error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
        toast.error(
          "Validation Error: " + errors[Object.keys(errors)[0]] ||
            "Please fix the errors in the form"
        );
      } else {
        toast.error(
          error?.response?.data?.errors[0]?.message ||
            "An unexpected error occurred"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-8 lg:mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-48" />
                </div>

                {/* Form Fields Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Payment Options Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border p-6 space-y-6 sticky top-6">
                <Skeleton className="h-6 w-32" />

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-20 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-18" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-primary">
            Checkout
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
            Complete your order for{" "}
            <span className="font-semibold text-primary">
              {product?.title || product?.course_title}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <OrderSummary
            product={product}
            promoApplied={promoApplied}
            promoData={promoData}
            deliveryFee={deliveryFee}
            quantity={quantity}
            setQuantity={setQuantity}
            deliveryMethod={formData.deliveryMethod || "inside_dhaka"}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onApplyPromo={checkPromoCode}
            paymentType={paymentType}
            isBook={isBook}
          />

          {/* Customer Information */}
          <CustomerInformation
            formData={formData}
            handleInputChange={handleInputChange}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            onSubmit={handleSubmit}
            onApplyPromo={checkPromoCode}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            promoApplied={promoApplied}
            promoData={promoData}
            product={product}
            isBook={isBook}
            validationErrors={validationErrors}
          />
        </div>
      </div>
    </main>
  );
}
