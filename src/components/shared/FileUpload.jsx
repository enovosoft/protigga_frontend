import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { CheckCircle2, FileUp, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FileUpload({
  onUploadSuccess,
  label = "Upload File",
  accept = ".pdf",
  supportedTypes = "PDF",
  maxSize = 10,
  autoUpload = false,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile) => {
    const acceptedTypes = accept
      .split(",")
      .map((ext) => ext.trim().toLowerCase());
    const fileExtension =
      "." + selectedFile.name.split(".").pop().toLowerCase();

    // Check if any accepted type matches
    const isAccepted = acceptedTypes.some((type) => {
      if (type === "image/*") {
        // Accept common image formats
        return [".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(
          fileExtension
        );
      } else if (type === "*/*" || type === "*") {
        // Accept all files
        return true;
      } else {
        // Check exact extension match
        return type === fileExtension;
      }
    });

    if (!isAccepted) {
      toast.error(`Only ${supportedTypes} files are supported`);
      return false;
    }

    const fileSizeMB = selectedFile.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setUploadedUrl("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setUploadedUrl("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        const fileUrl = response.data.file_link || response.data.url;
        setUploadedUrl(fileUrl);
        toast.success("File uploaded successfully!");

        if (onUploadSuccess) {
          onUploadSuccess(fileUrl);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadedUrl("");
    if (onUploadSuccess) {
      onUploadSuccess("");
    }
  };

  // Auto-upload when file is selected
  useEffect(() => {
    if (autoUpload && file && !uploading && !uploadedUrl) {
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, autoUpload]);

  return (
    <div className="space-y-3 w-full overflow-hidden">
      <Label className="text-sm font-medium">{label}</Label>

      {!uploadedUrl ? (
        <div className="space-y-3 w-full">
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors w-full ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept={accept}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center">
                <FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
              <div className="px-2">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Drop your {supportedTypes} file here, or{" "}
                  <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: {supportedTypes} • Max size: {maxSize}MB
                </p>
              </div>
            </div>
          </div>

          {/* File Preview */}
          {file && (
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-accent rounded-lg border border-border overflow-hidden w-full">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" />
                ) : (
                  <FileUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {!autoUpload && (
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    size="sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-success/10 rounded-lg border border-success/20 overflow-hidden w-full">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-success/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs sm:text-sm font-semibold text-success-foreground">
              File uploaded successfully!
            </p>
            <p
              className="text-xs text-muted-foreground truncate w-full"
              style={{ wordBreak: "break-all" }}
            >
              {uploadedUrl}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
