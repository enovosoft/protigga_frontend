export const PAYMENT_DELIVERY_OPTIONS = [
  {
    value: "sslcommerz",
    label: "SSL COMMERZ",
    deliveryCharge: 60, // Sundarban delivery charge for online payment
    advancePayment: 0, // Full payment required
    deliveryMethods: [], // No delivery method selection needed
    description: "Pay full amount in online.",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    deliveryCharge: 0, // Delivery charge based on district (Dhaka/Outside)
    advancePayment: 200, // Advance payment plus delivery charge
    deliveryMethods: [], // No manual selection, auto-determined by district
    description: "Pay ৳200 advance + delivery charge and rest on delivery",
  },
];

export const DIVISIONS = [
  { value: "dhaka", label: "Dhaka" },
  { value: "chattogram", label: "Chattogram" },
  { value: "sylhet", label: "Sylhet" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "khulna", label: "Khulna" },
  { value: "barishal", label: "Barishal" },
  { value: "rangpur", label: "Rangpur" },
  { value: "mymensingh", label: "Mymensingh" },
];
