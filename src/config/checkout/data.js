export const DELIVERY_OPTIONS = [
  {
    value: "inside_dhaka",
    label: "Inside Dhaka",
    price: 80,
  },
  {
    value: "outside_dhaka",
    label: "Outside Dhaka",
    price: 160,
  },
  {
    value: "sundarban",
    label: "Sundarban Courier",
    price: 60,
  },
];

export const PAYMENT_DELIVERY_OPTIONS = [
  {
    value: "sslcommerz",
    label: "SSL COMMERZ",
    deliveryCharge: 0, // No delivery charge for online payment
    advancePayment: 0, // Full payment required
    deliveryMethods: [], // No delivery method selection needed
    description: "Pay full amount in online.",
  },
  {
    value: "sundarban",
    label: "Sundarban Courier",
    deliveryCharge: 60, // Fixed delivery charge
    advancePayment: 0, // Full payment required
    deliveryMethods: [], // No delivery method selection needed
    description:
      "Pay full amount with delivery charge 60৳. You need to pickup from Sundarban Courier service point.",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    deliveryCharge: 0, // Delivery charge based on selected delivery method
    advancePayment: 200, // Advance payment plus delivery charge
    deliveryMethods: [
      { value: "inside_dhaka", label: "Inside Dhaka", price: 80 },
      { value: "outside_dhaka", label: "Outside Dhaka", price: 160 },
    ],
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
