import { BookOpen, ShoppingCart, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DELIVERY_OPTIONS } from "@/config/checkout/data";

export default function OrderSummary({
  product = null,
  promoApplied = false,
  promoData = null,
  deliveryFee = 0,
  quantity = 1,
  setQuantity = () => {},
  deliveryMethod = "inside_dhaka",
  setDeliveryMethod = () => {},
  promoCode = "",
  setPromoCode = () => {},
  onApplyPromo = () => {},
}) {
  const isBook = product?.title && !product?.course_title;

  const calculateSubtotal = () => {
    return (product?.price || 0) * Math.min(Math.max(quantity || 1, 1), 10000);
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

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="p-3 bg-primary/10 rounded-lg">
            {isBook ? (
              <BookOpen className="w-6 h-6 text-primary" />
            ) : (
              <BookOpen className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {product?.title || product?.course_title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBook ? "Book" : "Course"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl lg:text-2xl font-bold text-primary">
              ৳{product.price}
            </p>
          </div>
        </div>

        {/* Promo Code Section - moved under product name */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <Label className="text-sm font-medium text-foreground">
              Promo Code (Optional)
            </Label>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={onApplyPromo}
              disabled={promoApplied || !promoCode?.trim()}
              className="px-4"
            >
              Apply
            </Button>
          </div>
          {promoApplied && promoData && (
            <div className="bg-success/50 border border-success/40 p-3 rounded-lg">
              <p className="text-sm text-primary font-medium">
                Promo code applied! You saved{" "}
                {promoData.Discount_type === "percentage"
                  ? `${promoData.Discount}%`
                  : `BDT ${promoData.Discount}`}
              </p>
            </div>
          )}
        </div>

        {/* Quantity Input - Only for Books */}
        {isBook && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="10000"
              value={quantity || 1}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(value, 1), 10000));
              }}
              onBlur={(e) => {
                if (!e.target.value || e.target.value < 1) {
                  setQuantity(1);
                }
              }}
              className="w-full"
            />
            {quantity >= 10000 && (
              <p className="text-xs text-muted-foreground">
                Maximum quantity is 10,000
              </p>
            )}
          </div>
        )}

        {/* Delivery Options - Only for Books */}
        {isBook && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Delivery Method
            </Label>
            <Tabs
              value={deliveryMethod}
              onValueChange={setDeliveryMethod}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-auto">
                {DELIVERY_OPTIONS.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className="text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs opacity-75">
                        ৳{option.price}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">
              ৳{calculateSubtotal()}
            </span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-success">
              <span>Discount ({promoData?.Discount}%):</span>
              <span>-৳{calculateDiscount()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Fee:</span>
            <span className="font-medium text-foreground">৳{deliveryFee}</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">৳{calculateTotal()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
