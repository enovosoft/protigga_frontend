import { User, Tag, CreditCard, InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  DELIVERY_OPTIONS,
  DIVISIONS,
  PAYMENT_OPTIONS,
} from "@/config/checkout/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}) {
  const getPaymentOptions = () => {
    if (isBook) {
      return PAYMENT_OPTIONS; // Both options for books
    } else {
      return PAYMENT_OPTIONS.filter((option) => option.value === "sslcommerz"); // Only SSL for courses
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
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                require
                title="Phone number should be in the format 01XXXXXXXXXX"
                className="w-full"
              />
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
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="division"
                className="text-sm font-medium text-foreground"
              >
                Division <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.division}
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

            {/* Cash on Delivery Info Alert */}
            {paymentType === "cod" && isBook && (
              <Alert className="mt-3 border-warning/50 bg-warning/40">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription className="text-warning-foreground">
                  For Cash on Delivery, you need to pay ৳200 in advance to
                  confirm your order. The remaining amount will be collected
                  upon delivery.
                </AlertDescription>
              </Alert>
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
