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
import { DIVISIONS, PAYMENT_DELIVERY_OPTIONS } from "@/config/checkout/data";
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
  totalAmount = 0,
  deliveryFee = 0,
  user = null,
}) {
  const getPaymentOptions = () => {
    if (isBook) {
      return PAYMENT_DELIVERY_OPTIONS; // SSL COMMERZ and COD for books
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
        {/* User Information - Readonly */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                value={user?.name || ""}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>
            {isBook && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Phone Number
                </Label>
                <Input
                  value={user?.phone || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Course-specific fields */}
          {!isBook && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp_number"
                  className="text-sm font-medium text-foreground"
                >
                  WhatsApp Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsapp_number"
                  placeholder="+8801XXXXXXXXX"
                  value={formData.whatsapp_number}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Ensure it starts with +880
                    if (!value.startsWith("+880")) {
                      value = "+880" + value.replace(/^\+?880?/, "");
                    }
                    // Limit to 14 characters (+880 + 10 digits)
                    if (value.length <= 14) {
                      handleInputChange("whatsapp_number", value);
                    }
                  }}
                  required
                  pattern="^\+8801[0-9]{9}$"
                  title="WhatsApp number must be in the format +8801XXXXXXXXX. If you have a different number linked with whatsapp use that."
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground ">
                  If you have a different whatsapp number, enter that.
                </p>
                {validationErrors.whatsapp_number && (
                  <p className="text-sm text-destructive">
                    {validationErrors.whatsapp_number}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fb_name"
                  className="text-sm font-medium text-foreground"
                >
                  Facebook Profile Name{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fb_name"
                  placeholder="Your Facebook Profile Name"
                  value={formData.fb_name}
                  onChange={(e) => handleInputChange("fb_name", e.target.value)}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Facebook profile name
                </p>
                {validationErrors.fb_name && (
                  <p className="text-sm text-destructive">
                    {validationErrors.fb_name}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Book-specific alternative phone field */}
          {isBook && (
            <div className="space-y-2">
              <Label
                htmlFor="alternative_phone"
                className="text-sm font-medium text-foreground"
              >
                Alternative Phone Number (Optional)
              </Label>
              <Input
                id="alternative_phone"
                placeholder="+8801XXXXXXXXX"
                value={formData.alternative_phone}
                onChange={(e) => {
                  let value = e.target.value;
                  // Ensure it starts with +880
                  if (!value.startsWith("+880")) {
                    value = "+880" + value.replace(/^\+?880?/, "");
                  }
                  // Limit to 14 characters (+880 + 10 digits)
                  if (value.length <= 14) {
                    handleInputChange("alternative_phone", value);
                  }
                }}
                pattern="^\+8801[0-9]{9}$"
                title="Phone number must be in the format +8801XXXXXXXXX"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Alternative phone number must start with +880 and be 14 digits
                total
              </p>
              {validationErrors.alternative_phone && (
                <p className="text-sm text-destructive">
                  {validationErrors.alternative_phone}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
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

          {/* Address and Location Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onValueChange={(value) =>
                  handleInputChange("division", value || "")
                }
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

            {/* Cash on Delivery Info Alert */}
            {isBook && paymentType === "cod" && (
              <PinMessage
                variant="info"
                message="For Cash on Delivery, you need pay BDT 200 + delivery charge in advance"
              />
            )}

            {isBook && paymentType === "sslcommerz" && (
              <PinMessage
                variant="info"
                message="For online payment, you will pay full amount including Sundarban Courier delivery charge"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Pay now ৳{paymentType === "sslcommerz" ? totalAmount : totalAmount}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
