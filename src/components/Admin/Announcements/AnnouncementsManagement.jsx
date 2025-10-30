import AnnouncementDialog from "@/components/Admin/Announcements/AnnouncementDialog";
import AnnouncementsTable, {
  AnnouncementsTableSkeleton,
} from "@/components/Admin/Announcements/AnnouncementsTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { getAnnouncementStatusBadge } from "@/lib/badgeUtils";
import { format } from "date-fns";
import { Eye, FileText, Loader2, MessageSquare, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AnnouncementsManagement({ useLayout = true }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get("/announcements");
      if (response.data.success) {
        let announcements = response.data?.announcements || [];

        announcements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(announcements);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDialogOpen(true);
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setViewDialogOpen(true);
  };

  const handleDelete = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(
        `/announcement/${announcementToDelete.announcement_id}`
      );
      if (response.data.success) {
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } else {
        throw new Error(
          response.data.message || "Failed to delete announcement"
        );
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete announcement"
      );
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP p");
    } catch {
      return "Invalid date";
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Announcements Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage course announcements for students
          </p>
        </div>
        <Button onClick={handleCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {loading ? (
        <AnnouncementsTableSkeleton />
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first announcement for students.
          </p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Announcement
          </Button>
        </div>
      ) : (
        <>
          <AnnouncementsTable
            announcements={currentAnnouncements}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={announcements.length}
              startIndex={startIndex}
              endIndex={Math.min(endIndex, announcements.length)}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSuccess={fetchAnnouncements}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Announcement Details
            </DialogTitle>
            <DialogDescription>
              View complete announcement information
            </DialogDescription>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-6">
              {/* Title and Status */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold flex-1">
                    {selectedAnnouncement.title}
                  </h3>
                  {getAnnouncementStatusBadge(selectedAnnouncement.status)}
                </div>
              </div>

              {/* Description */}
              {selectedAnnouncement.description && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedAnnouncement.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Course Information */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium">Course ID:</span>{" "}
                    {selectedAnnouncement.course_id}
                  </p>
                </CardContent>
              </Card> */}

              {/* Date Range */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Start:</span>{" "}
                    {formatDate(selectedAnnouncement.start_date)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">End:</span>{" "}
                    {formatDate(selectedAnnouncement.end_date)}
                  </p>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SMS Notification */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      SMS Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={
                        selectedAnnouncement.is_send_sms
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedAnnouncement.is_send_sms
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </CardContent>
                </Card>

                {/* Attachment */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Attachment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAnnouncement.attachment_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            selectedAnnouncement.attachment_url,
                            "_blank"
                          )
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View File
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No attachment
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timestamps */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedAnnouncement.createdAt)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{announcementToDelete?.title}"?
              This action cannot be undone and will remove the announcement
              permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}
