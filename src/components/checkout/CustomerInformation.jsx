import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { CreditCard, User } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DELIVERY_OPTIONS,
  DIVISIONS,
  PAYMENT_DELIVERY_OPTIONS,
} from "@/config/checkout/data";
import PinMessage from "../shared/PinMessage";

export default function CustomerInformation({
  formData,
  handleInputChange,
  paymentType,
  setPaymentType,
  onSubmit,
  onApplyPromo,
  promoCode = "",
  setPromoCode = () => {},
  promoApplied = false,
  promoData = null,
  product = null,
  isBook = false,
  validationErrors = {},
}) {
  const getPaymentOptions = () => {
    if (isBook) {
      return PAYMENT_DELIVERY_OPTIONS; // All options for books
    } else {
      return PAYMENT_DELIVERY_OPTIONS.filter(
        (option) => option.value === "sslcommerz"
      ); // Only SSL for courses
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <User className="w-5 h-5 text-primary" />
          Order Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Information Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full"
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+8801XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value;
                  // Ensure it starts with +880
                  if (!value.startsWith("+880")) {
                    value = "+880" + value.replace(/^\+?880?/, "");
                  }
                  // Limit to 14 characters (+880 + 10 digits)
                  if (value.length <= 14) {
                    handleInputChange("phone", value);
                  }
                }}
                required
                pattern="^\+8801[0-9]{9}$"
                title="Phone number must be in the format +8801XXXXXXXXX"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Phone number must start with +880 and be 14 digits total
              </p>
              {validationErrors.phone && (
                <p className="text-sm text-destructive">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full"
              />
              {validationErrors.email && (
                <p className="text-sm text-destructive">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-foreground"
              >
                Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="House, road, Area"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                className="w-full"
              />
              {validationErrors.address && (
                <p className="text-sm text-destructive">
                  {validationErrors.address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-foreground"
              >
                Thana / State <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Thana name"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
                className="w-full"
              />
              {validationErrors.city && (
                <p className="text-sm text-destructive">
                  {validationErrors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="text-sm font-medium text-foreground"
              >
                District <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                placeholder="District name"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                required
                className="w-full"
              />
              {validationErrors.district && (
                <p className="text-sm text-destructive">
                  {validationErrors.district}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="zipCode"
                className="text-sm font-medium text-foreground"
              >
                Zip Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="zipCode"
                placeholder="1230"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                required
                className="w-full"
              />
              {validationErrors.zipCode && (
                <p className="text-sm text-destructive">
                  {validationErrors.zipCode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="division"
                className="text-sm font-medium text-foreground"
              >
                Division <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.division || ""}
                onValueChange={(value) => handleInputChange("division", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((division) => (
                    <SelectItem key={division.value} value={division.value}>
                      {division.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.division && (
                <p className="text-sm text-destructive">
                  {validationErrors.division}
                </p>
              )}
            </div>
          </div>

          {/* Payment Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <Label className="text-sm font-medium text-foreground">
                Payment Method <span className="text-destructive">*</span>
              </Label>
            </div>
            <RadioGroup
              value={paymentType}
              onValueChange={(value) => {
                setPaymentType(value);
              }}
              className="space-y-3"
            >
              {getPaymentOptions().map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer ${
                    paymentType === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/30"
                  }`}
                  onClick={() => setPaymentType(option.value)}
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentType === option.value
                          ? "border-primary"
                          : "border-muted-foreground/50"
                      }`}
                    >
                      {paymentType === option.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="cursor-pointer font-medium text-foreground">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {/* Delivery Method Selection - Only for COD */}
            {isBook && paymentType === "cod" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Delivery Method <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.deliveryMethod || "inside_dhaka"}
                  onValueChange={(value) =>
                    handleInputChange("deliveryMethod", value)
                  }
                  className="space-y-2"
                >
                  {DELIVERY_OPTIONS.filter(
                    (option) => option.value !== "sundarban"
                  ).map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors cursor-pointer ${
                        formData.deliveryMethod === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/30"
                      }`}
                      onClick={() =>
                        handleInputChange("deliveryMethod", option.value)
                      }
                    >
                      <div className="flex items-center h-5">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            formData.deliveryMethod === option.value
                              ? "border-primary"
                              : "border-muted-foreground/50"
                          }`}
                        >
                          {formData.deliveryMethod === option.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Label className="cursor-pointer font-medium text-foreground">
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          ৳{option.price} delivery charge
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Cash on Delivery Info Alert */}
            {isBook && paymentType === "cod" && (
              <PinMessage
                variant="info"
                message="For Cash on Delivery, you need pay BDT 200 + delivery charge in advance"
              />
            )}

            {isBook && paymentType === "sundarban" && (
              <PinMessage
                variant="info"
                message="For Currier delivery, you need pay full amount also collect from Sundarban Courier service point"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Place Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
