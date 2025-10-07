import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import apiInstance from "@/lib/api";

import OrderSummary from "./OrderSummary";
import CustomerInformation from "./CustomerInformation";

import {
  DELIVERY_OPTIONS,
  DIVISIONS,
  PAYMENT_OPTIONS,
} from "@/config/checkout/data";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState(null);
  const [paymentType, setPaymentType] = useState("cod");
  const [deliveryFee, setDeliveryFee] = useState(200);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("inside_dhaka");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    division: "",
  });

  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");
  const bookSlug = searchParams.get("book");

  const isBook = bookSlug && !courseId;

  useEffect(() => {
    // Update delivery fee based on delivery method for books only
    if (isBook) {
      const deliveryOptions = [
        { value: "inside_dhaka", label: "Inside Dhaka", price: 80 },
        { value: "outside_dhaka", label: "Outside Dhaka", price: 160 },
        { value: "sundarban", label: "Sundarban Courier", price: 60 },
      ];
      const selectedOption = deliveryOptions.find(
        (option) => option.value === deliveryMethod
      );
      if (selectedOption) {
        setDeliveryFee(selectedOption.price);
      }
    } else {
      // Courses have no delivery fee
      setDeliveryFee(0);
    }
  }, [deliveryMethod, isBook]);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated && !authLoading) {
      toast.error("Please login first to continue purchasing");
      // navigate("/auth/login", {
      //   state: {
      //     message: `Please login first to continue purchasing ${
      //       product?.title || product?.course_title || "this item"
      //     }`,
      //     variant: "warning",
      //     successRedirect: location.pathname + location.search,
      //   },
      // });
      return;
    }

    fetchProductDetails();
  }, [isAuthenticated, authLoading, searchParams, navigate, location]);

  const fetchProductDetails = async () => {
    if (courseId) {
      // Handle course checkout (existing logic)
      try {
        const response = await apiInstance.get(`/courses/${courseId}`);
        if (response.data) {
          const course = response.data;
          setProduct(course);
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
        } else {
          toast.error("Book not found");
          navigate("/books");
          return;
        }
      } catch (error) {
        toast.error("Failed to load book details");
        navigate("/books");
        return;
      }
    } else {
      toast.error("No product specified");
      navigate("/");
      return;
    }

    setIsLoading(false);
  };

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

        toast.success(
          `Promo code applied! ${promo.Discount}% off (Max ৳${promo.Max_discount_amount})`
        );
        return;
      } else {
        toast.error(response.data.message || "Invalid promo code");
        setPromoApplied(false);
        setPromoData(null);
      }
    } catch (error) {
      console.error("Promo code validation error:", error);
      toast.error("Failed to validate promo code");
      setPromoApplied(false);
      setPromoData(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.district ||
      !formData.division
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare data in the format specified by user
    const orderData = {
      amount: calculateTotal(),
      tran_id: "TaBD72G5v", // Generate a random transaction ID
      meterial_type: product.title ? "book" : "course",
      delevery_type: paymentType === "cod" ? "COD" : "SSL",
      payment_method: paymentType,
      customer: {
        name: formData.name,
        email: formData.email || user?.email || "",
        address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.division}`,
        phone: formData.phone,
      },
      meterial_details: {
        product_name: product.title || product.course_title,
        user_id: user?.id || "",
        product_price: product.price,
        discount: calculateDiscount(),
        quantity: quantity,
        promo_code: promoApplied ? promoCode : "",
        promo_code_id: promoApplied ? "promo_6789" : "",
        address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.division}`,
        status: "pending",
        Txn_ID: "324234",
        confirmed: false,
        delivery_fee: deliveryFee,
        delivery_method: isBook ? deliveryMethod : null,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
      },
    };

    // Show alert with the parsed data for now
    alert(`Order data prepared:\n${JSON.stringify(orderData, null, 2)}`);

    // For now, just show success message
    toast.success(
      "Order data prepared successfully! Integration with payment gateway coming soon."
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
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
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onApplyPromo={checkPromoCode}
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
          />
        </div>
      </div>
    </main>
  );
}
