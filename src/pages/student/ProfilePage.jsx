import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Badge } from "@/components/ui/badge";
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
import { formatDistanceToNow } from "date-fns";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const profile = useStoreState((state) => state.student.profile);
  const loading = useStoreState((state) => state.student.loading);
  const changePassword = useStoreActions(
    (actions) => actions.student.changePassword
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    prev_password: "",
    password: "",
    confirm_password: "",
  });

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
    <UserDashboardLayout>
      <div className="container mx-auto p-4 max-w-4xl">
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
              <div>
                <Label className="text-sm font-medium">Verified</Label>
                {loading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <Badge
                    variant={profile?.is_verified ? "default" : "secondary"}
                  >
                    {profile?.is_verified ? "Verified" : "Not Verified"}
                  </Badge>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">Created At</Label>
                {loading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <p className="text-lg">
                    {profile?.createdAt
                      ? formatDistanceToNow(new Date(profile.createdAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </p>
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
                  <Input
                    id="prev_password"
                    name="prev_password"
                    type="password"
                    value={formData.prev_password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Change Password
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
