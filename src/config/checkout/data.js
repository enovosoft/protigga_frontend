import toast from "react-hot-toast";

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

export const PAYMENT_OPTIONS = [
  { value: "sslcommerz", label: "SSL COMMERZ" },
  { value: "cod", label: "Cash on Delivery" },
];
