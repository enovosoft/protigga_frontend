import Loading from "@/components/shared/Loading";
import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { profile, loading } = useStoreState((state) => state.student);
  const { changePassword } = useStoreActions((actions) => actions.student);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    prev_password: "",
    password: "",
    confirm_password: "",
  });
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
    const payload = {
      phone: profile.phone,
      password: formData.password,
      prev_password: formData.prev_password,
    };
    await changePassword(payload);
    setDialogOpen(false);
    setFormData({ prev_password: "", password: "", confirm_password: "" });
  };

  return (
    <>
      {loading && <Loading />}
      <StudentDashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  {loading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    <p className="text-lg">{profile?.name}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  {loading ? (
                    <Skeleton className="h-6 w-40" />
                  ) : (
                    <p className="text-lg">{profile?.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Update Password</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="prev_password">Current Password</Label>
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
                        type={showNewPassword ? "text" : "password"}
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        required
                        placeholder="Re-enter new password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        aria-label={
                          showNewPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
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
                  <Button type="submit" className="w-full">
                    Change Password
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </StudentDashboardLayout>
    </>
  );
}
