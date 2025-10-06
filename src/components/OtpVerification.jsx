import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiInstance from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function OtpVerification({
  phoneNumber,
  onSuccess,
  redirectTo = "/auth/login",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onOtpSubmit = async (data) => {
    setIsLoading(true);
    try {
      await apiInstance.post("/auth/verify/otp", {
        phone: `+880${phoneNumber}`,
        otp: data.otp,
        otp_type: "registration",
      });
      toast.success("Verification successful!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      await apiInstance.post("/auth/resend-otp", {
        phone: `+880${phoneNumber}`,
      });
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-base">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-foreground">
              +880{phoneNumber}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-semibold h-14"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-destructive">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={resendOtp}
                disabled={isResending}
                className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                {isResending
                  ? "Resending..."
                  : "Didn't receive code? Resend OTP"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
