import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ShoppingCart, Tag } from "lucide-react";
import ImageFallback from "../shared/ImageFallback";

export default function OrderSummary({
  product = null,
  promoApplied = false,
  promoData = null,
  deliveryFee = 0,
  quantity = 1,
  setQuantity = () => {},
  district = "",
  promoCode = "",
  setPromoCode = () => {},
  onApplyPromo = () => {},
  paymentType = "cod",
  isBook = false,
  calculateSubtotal = () => 0,
  calculateDiscount = () => 0,
  calculateTotal = () => 0,
}) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="p-2 sm:p-3 overflow-hidden">
          <ImageFallback
            src={product.book_image || product.thumbnail}
            alt={product.title}
            className="w-full rounded-xl sm:rounded-2xl transition-transform object-cover"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0 hidden sm:block">
            {isBook ? (
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            ) : (
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              {product?.title || product?.course_title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isBook ? "Book" : "Course"}
            </p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
              ৳{product.price}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <Label className="text-sm sm:text-base font-medium text-foreground">
              Promo Code (Optional)
            </Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
              className="px-3 sm:px-4 w-full sm:w-auto"
            >
              Apply
            </Button>
          </div>
          {promoApplied && promoData && (
            <div className="bg-success/50 border border-success/40 p-3 rounded-lg">
              <p className="text-xs sm:text-sm text-primary font-medium">
                Promo code applied! You saved{" "}
                {promoData.Discount_type === "percentage"
                  ? `${promoData.Discount}%`
                  : `৳ ${promoData.Discount}`}
              </p>
            </div>
          )}
        </div>

        {/* Quantity Input - Only for Books */}
        {isBook && (
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-foreground">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="10000"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuantity(value);
              }}
              className="w-full"
            />
            {quantity >= 10000 && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Maximum quantity is 10,000
              </p>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">
              ৳{calculateSubtotal()}
            </span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm sm:text-base text-success">
              <span>
                Discount{" "}
                {promoData.Discount_type === "percentage"
                  ? `${promoData.Discount}%`
                  : `৳ ${promoData.Discount}`}{" "}
                :
              </span>
              <span>-৳{calculateDiscount()}</span>
            </div>
          )}

          {isBook && (
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Delivery Fee:</span>
              <span className="font-medium text-foreground">
                {paymentType === "sslcommerz" &&
                  `Sundarban Courier (৳${deliveryFee})`}
                {paymentType === "cod" &&
                  (district?.toLowerCase().trim() === "dhaka"
                    ? `Inside Dhaka (৳${deliveryFee})`
                    : `Outside Dhaka (৳${deliveryFee})`)}
              </span>
            </div>
          )}
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg sm:text-xl font-bold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">৳{calculateTotal()}</span>
            </div>
          </div>
        </div>

        {paymentType === "cod" && (
          <>
            <div className="flex justify-between text-sm sm:text-base ">
              <span className="text-foreground">Pay Now:</span>
              <span className="font-medium text-success">৳{200}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base ">
              <span className="text-foreground">Due:</span>
              <span className="font-medium text-destructive">
                ৳{calculateTotal() - 200 < 0 ? 0 : calculateTotal() - 200}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
