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
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const phoneSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
});

const otpPasswordSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resendTimer, setResendTimer] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpPasswordForm = useForm({
    resolver: zodResolver(otpPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Timer effect for resend countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0 && !canResend && step === "otp") {
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
  }, [resendTimer, canResend, step]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onPhoneSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiInstance.post("/auth/reset-password/send-otp", {
        phone: `+880${data.phone}`,
      });
      setPhoneNumber(data.phone);
      setStep("otp");
      setResendTimer(180); // Reset to 3 minutes
      setCanResend(false);
      toast.success(response.data.message || "OTP sent to your phone number");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Send OTP, phone, and password to complete reset
      await apiInstance.post("/auth/reset-password", {
        phone: `+880${phoneNumber}`,
        otp: data.otp,
        password: data.password,
      });

      toast.success("Password reset successful!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const response = await apiInstance.post("/auth/reset-password/send-otp", {
        phone: `+880${phoneNumber}`,
      });
      setResendTimer(180); // Reset to 3 minutes
      setCanResend(false);
      toast.success(response.data.message || "OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP + Password Step
  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          className="fixed top-4 left-4 z-10 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Verify OTP & Reset Password
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
              onSubmit={otpPasswordForm.handleSubmit(onOtpSubmit)}
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
                  {...otpPasswordForm.register("otp")}
                />
                {otpPasswordForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">
                    {otpPasswordForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    className="pl-10 pr-10"
                    {...otpPasswordForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {otpPasswordForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {otpPasswordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="pl-10 pr-10"
                    {...otpPasswordForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {otpPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {otpPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={!canResend || isLoading}
                  className={`text-sm font-medium transition-colors ${
                    canResend
                      ? "text-secondary hover:text-secondary/80"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {canResend
                    ? "Didn't receive code? Resend OTP"
                    : `Resend OTP in ${formatTime(resendTimer)}`}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to phone number
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Phone Number Step (Default)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      {/* Back Button */}
      <Button
        variant="secondary"
        size="sm"
        className="fixed top-4 left-4 z-10 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your phone number to receive an OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <div className="absolute left-11 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex items-center">
                  <span className="text-sm font-medium">+880</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1XXXXXXXXX"
                  className="pl-20"
                  {...phoneForm.register("phone")}
                />
              </div>
              {phoneForm.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              <Link
                to="/auth/login"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
