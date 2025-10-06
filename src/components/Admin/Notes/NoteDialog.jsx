import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NoteDialog({ open, onOpenChange, note, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    note_name: "",
    note_desc: "",
    note_file_link: "",
  });
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (note) {
      setFormData({
        note_name: note.note_name || "",
        note_desc: note.note_desc || "",
        note_file_link: note.note_file_link || "",
      });
    } else {
      setFormData({
        note_name: "",
        note_desc: "",
        note_file_link: "",
      });
    }
  }, [note, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      note_file_link: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.note_name.trim()) {
      toast.error("Note name is required");
      return;
    }
    if (!formData.note_desc.trim()) {
      toast.error("Note description is required");
      return;
    }
    if (!formData.note_file_link.trim()) {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);

    try {
      let response;

      const payload = {
        ...formData,
        shared_by: user?.name || "Admin",
      };

      if (note) {
        // Update existing note
        response = await api.put("/note", {
          ...payload,
          note_id: note.note_id,
          slug: note.slug,
        });
      } else {
        // Create new note
        response = await api.post("/note", payload);
      }

      if (response.data.success) {
        toast.success(
          note ? "Note updated successfully!" : "Note created successfully!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Note operation error:", error);
      toast.error(error.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] w-[calc(100vw-1.5rem)] sm:w-full mx-auto p-0 gap-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[85vh] px-6 py-6">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <DialogTitle className="text-base sm:text-xl truncate">
                  {note ? "Edit Note" : "Add New Note"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm truncate">
                  {note
                    ? "Update the note details below."
                    : "Fill in the details to add a new note."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 mt-4 overflow-x-hidden"
          >
            {/* Show existing PDF link when editing */}
            {note && note.note_file_link && (
              <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden w-full">
                <Label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
                  Current PDF File:
                </Label>
                <div className="overflow-hidden w-full">
                  <a
                    href={note.note_file_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:underline break-words block w-full overflow-hidden"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {note.note_file_link}
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a new file below to replace the current one
                </p>
              </div>
            )}

            <div className="space-y-2 overflow-hidden">
              <Label htmlFor="note_name" className="text-sm font-medium">
                Note Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="note_name"
                name="note_name"
                value={formData.note_name}
                onChange={handleChange}
                placeholder="HSC Physics"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2 overflow-hidden">
              <Label htmlFor="note_desc" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="note_desc"
                name="note_desc"
                value={formData.note_desc}
                onChange={handleChange}
                placeholder={`এইচএসসি ২৭ ব্যাচের নোটঃ 
                - অধ্যায় ১: ভেক্টর
                - অধ্যায় ২: গতিবিদ্যা
                - অধ্যায় ৩: বল ও গতি
                - অধ্যায় ৪: কাজ, শক্তি ও শক্তির সংরক্ষণ
                - অধ্যায় ৫: তরঙ্গ`}
                required
                rows={6}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            <div className="overflow-hidden">
              <FileUpload
                label={
                  <span>
                    Upload Note PDF File{" "}
                    <span className="text-destructive">*</span>
                  </span>
                }
                accept=".pdf"
                supportedTypes="PDF"
                maxSize={10}
                autoUpload={true}
                onUploadSuccess={handleFileUpload}
              />
            </div>

            {formData.note_file_link && (
              <Input
                type="hidden"
                name="note_file_link"
                value={formData.note_file_link}
              />
            )}

            <div className="p-3 bg-muted rounded-lg overflow-hidden">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Shared by:</span>{" "}
                {user?.name || "Admin"}
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {note ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{note ? "Update Note" : "Create Note"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
