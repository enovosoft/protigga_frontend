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
import { ArrowLeft, ArrowRight, Loader2, Phone } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [resendTimer, setResendTimer] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Timer effect for resend countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
    if (!canResend) return;

    setIsResending(true);
    try {
      await apiInstance.post("/auth/resend-otp", {
        phone: `+880${phoneNumber}`,
      });
      toast.success("OTP resent successfully");
      setResendTimer(180); // Reset to 3 minutes
      setCanResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-3 sm:p-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-3 sm:top-4 left-3 sm:left-4 z-10 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center pb-3 sm:pb-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-secondary/20 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-foreground">
              +880{phoneNumber}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm sm:text-base font-medium">
                OTP Code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                className="text-center text-xl sm:text-2xl tracking-widest font-semibold h-12 sm:h-14"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-xs sm:text-sm text-destructive">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
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
                disabled={isResending || !canResend}
                className={`text-sm font-medium transition-colors ${
                  canResend && !isResending
                    ? "text-secondary hover:text-secondary/80"
                    : "text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isResending
                  ? "Resending..."
                  : canResend
                  ? "Didn't receive code? Resend OTP"
                  : `Resend OTP in ${formatTime(resendTimer)}`}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
