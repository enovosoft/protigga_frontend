import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  Phone,
  User,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z
      .string()
      .regex(/^1[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function RegisterPage() {
  const [step, setStep] = useState("register"); // 'register' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onRegisterSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/registration", {
        name: data.fullName,
        phone: `+880${data.phone}`,
        password: data.password,
      });
      setPhoneNumber(data.phone);
      setStep("otp");
      toast.success("OTP sent to your phone number");
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify/otp", {
        phone: `+880${phoneNumber}`,
        otp: data.otp,
        otp_type: "registration",
      });
      toast.success("Registration successful!");
      navigate("/auth");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { phone: phoneNumber });
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "otp") {
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

              <Button
                type="submit"
                className="w-full h-11"
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
                  disabled={isLoading}
                  className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("register")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to registration
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Sign up to get started with your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  {...registerForm.register("fullName")}
                />
              </div>
              {registerForm.formState.errors.fullName && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.fullName.message}
                </p>
              )}
            </div>

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
                  {...registerForm.register("phone")}
                />
              </div>
              {registerForm.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  {...registerForm.register("password")}
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
              {registerForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  {...registerForm.register("confirmPassword")}
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
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/auth/login"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
