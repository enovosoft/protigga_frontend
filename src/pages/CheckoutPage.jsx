import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  BookOpen,
  CreditCard,
  MapPin,
  Phone,
  User,
  Tag,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Bangladesh divisions for dropdown
const BANGLADESH_DIVISIONS = [
  "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Barisal", "Sylhet", "Rangpur", "Mymensingh"
];

// Dummy data for books and courses
const DUMMY_BOOKS = {
  1: { id: 1, title: "HSC Physics Complete Guide", price: 450, type: "book" },
  2: { id: 2, title: "Advanced Chemistry Problems", price: 380, type: "book" },
  3: { id: 3, title: "Mathematics Formula Handbook", price: 280, type: "book" },
  4: { id: 4, title: "Biology MCQ Bank", price: 320, type: "book" },
};

const DUMMY_COURSES = {
  1: {
    id: 1,
    course_title: "Physics Complete Course - HSC 27",
    price: 2500,
    type: "course",
    has_promo: true
  },
  2: {
    id: 2,
    course_title: "Chemistry Crash Course - HSC 27",
    price: 2200,
    type: "course",
    has_promo: true
  },
  3: {
    id: 3,
    course_title: "Mathematics Advanced - HSC 27",
    price: 2800,
    type: "course",
    has_promo: false
  },
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    division: ""
  });

  useEffect(() => {
    fetchProductDetails();
  }, [searchParams]);

  const fetchProductDetails = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const courseId = searchParams.get("course");
    const bookId = searchParams.get("book");

    if (courseId && DUMMY_COURSES[courseId]) {
      const course = DUMMY_COURSES[courseId];
      setProduct(course);
      setDiscountedPrice(course.price);
    } else if (bookId && DUMMY_BOOKS[bookId]) {
      const book = DUMMY_BOOKS[bookId];
      setProduct(book);
      setDiscountedPrice(book.price);
    } else {
      toast.error("Product not found");
      navigate("/");
      return;
    }

    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    if (product?.type === "course" && product?.has_promo) {
      // Simulate promo code validation
      if (promoCode.toUpperCase() === "HSC2027") {
        const discount = Math.floor(product.price * 0.1); // 10% discount
        setDiscountedPrice(product.price - discount);
        setPromoApplied(true);
        toast.success(`Promo code applied! ৳${discount} discount`);
      } else {
        toast.error("Invalid promo code");
      }
    } else {
      toast.error("Promo codes are only available for courses");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone ||
        !formData.address || !formData.city || !formData.district || !formData.division) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate order processing
    toast.success("Order placed successfully! Redirecting to payment...");
    setTimeout(() => {
      navigate("/payment", {
        state: {
          product,
          formData,
          finalPrice: discountedPrice,
          promoApplied
        }
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Checkout
            </h1>
            <p className="text-muted-foreground text-lg">
              Complete your order for <span className="font-semibold text-primary">{product.title || product.course_title}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {product.type === "course" ? (
                        <BookOpen className="w-6 h-6 text-primary" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {product.title || product.course_title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.type === "course" ? "Online Course" : "Physical Book"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">৳{product.price}</p>
                      {promoApplied && (
                        <p className="text-sm text-success line-through">৳{product.price}</p>
                      )}
                    </div>
                  </div>

                  {product.type === "course" && product.has_promo && (
                    <div className="space-y-3">
                      <Label htmlFor="promo" className="text-sm font-medium">
                        Promo Code (Optional)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="promo"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={applyPromoCode}
                          className="px-4"
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        ৳{discountedPrice}
                      </span>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-success mt-1">
                        Promo code applied! You saved ৳{product.price - discountedPrice}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="+880 1XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                          pattern="[0-9]{3}-?[0-9]{2}-?[0-9]{3}-?[0-9]{4}"
                          title="Phone number should be in the format +880 XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        placeholder="House, road, Area"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          placeholder="City name"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          placeholder="District name"
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="division">Division *</Label>
                        <select
                          id="division"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                          value={formData.division}
                          onChange={(e) => handleInputChange("division", e.target.value)}
                          required
                        >
                          <option value="">Select Division</option>
                          {BANGLADESH_DIVISIONS.map(division => (
                            <option key={division} value={division}>{division}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Now - ৳{discountedPrice}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Payment will be processed using SSL Commerce
                      (Mobile Banking, Credit/Debit Card, Bank Transfer)
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
