import AdminLayout from "@/components/shared/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import apiInstance from "@/lib/api";
import { Eye, EyeOff, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    prev_password: "",
    password: "",
    confirm_password: "",
  });
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiInstance.post("/auth/change-password", {
        phone: user.phone,
        prev_password: formData.prev_password,
        password: formData.password,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password changed successfully");
      } else {
        toast.error(res.data.message || "Failed to change password");
      }
      setDialogOpen(false);
      setFormData({ prev_password: "", password: "", confirm_password: "" });
      setShowPrevPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      const errMsg = Array.isArray(error.response?.data?.errors)
        ? error.response?.data?.errors[0]?.message
        : error.response?.data?.message;
      toast.error(errMsg || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-lg mt-1">{user?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-lg mt-1">{user?.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="text-lg mt-1 capitalize">
                    {user?.role?.replace(/_/g, " ") || "Admin"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Security
                  </Label>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="prev_password">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="prev_password"
                              name="prev_password"
                              type={showPrevPassword ? "text" : "password"}
                              value={formData.prev_password}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter current password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              aria-label={
                                showPrevPassword
                                  ? "Hide current password"
                                  : "Show current password"
                              }
                              onClick={() => setShowPrevPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPrevPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showNewPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter new password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              aria-label={
                                showNewPassword
                                  ? "Hide new password"
                                  : "Show new password"
                              }
                              onClick={() => setShowNewPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="confirm_password">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirm_password"
                              name="confirm_password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirm_password}
                              onChange={handleInputChange}
                              required
                              placeholder="Re-enter new password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              aria-label={
                                showConfirmPassword
                                  ? "Hide confirm password"
                                  : "Show confirm password"
                              }
                              onClick={() => setShowConfirmPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Changing Password..."
                            : "Change Password"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
