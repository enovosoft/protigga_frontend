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
import api from "@/lib/api";
import { Book, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BookDialog({ open, onOpenChange, book, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    book_image: "",
    writter: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        price: book.price || "",
        book_image: book.book_image || "",
        writter: book.writter || "",
        description: book.description || "",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        book_image: "",
        writter: "",
        description: "",
      });
    }
  }, [book, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      book_image: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Book title is required");
      return;
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!formData.book_image.trim()) {
      toast.error("Please upload a book image");
      return;
    }
    if (!formData.writter.trim()) {
      toast.error("Writer name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Book description is required");
      return;
    }

    setLoading(true);

    try {
      let response;

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (book) {
        // Update existing book
        response = await api.put("/book", {
          ...payload,
          book_id: book.book_id,
          slug: book.slug,
        });
      } else {
        // Create new book
        response = await api.post("/book", payload);
      }

      if (response.data.success) {
        toast.success(
          book ? "Book updated successfully!" : "Book created successfully!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Book operation error:", error);
      toast.error(error.response?.data?.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-full mx-auto p-0 gap-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh] px-4 py-4 sm:px-6 sm:py-6">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Book className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <DialogTitle className="text-base sm:text-xl truncate">
                  {book ? "Edit Book" : "Add New Book"}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm truncate">
                  {book
                    ? "Update the book details below."
                    : "Fill in the details to add a new book."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden"
          >
            {/* Show existing book image when editing */}
            {book && book.book_image && (
              <div className="p-2.5 sm:p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden w-full">
                <Label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">
                  Current Book Image:
                </Label>
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={book.book_image}
                    alt={book.title}
                    className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded border flex-shrink-0"
                  />
                  <div className="overflow-hidden w-full">
                    <a
                      href={book.book_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-primary hover:underline break-words block w-full overflow-hidden"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {book.book_image}
                    </a>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                  Upload a new image below to replace the current one
                </p>
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
              <Label htmlFor="title" className="text-sm font-medium">
                Book Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Learning Zod"
                required
                className="w-full h-10 sm:h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (BDT) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299.00"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="writter" className="text-sm font-medium">
                  Writer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="writter"
                  name="writter"
                  value={formData.writter}
                  onChange={handleChange}
                  placeholder="Rashedul Islam"
                  required
                  className="w-full h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A complete guide to schema validation using Zod in Node.js applications."
                required
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-solid border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px] sm:min-h-[100px]"
              />
            </div>

            <div className="overflow-hidden p-1">
              <FileUpload
                label={
                  <span>
                    Upload Book Image{" "}
                    <span className="text-destructive">*</span>
                  </span>
                }
                accept="image/*"
                supportedTypes="Images (JPG, JPEG, PNG, GIF, WebP, SVG, BMP)"
                maxSize={5}
                autoUpload={true}
                onUploadSuccess={handleImageUpload}
              />
            </div>

            {formData.book_image && (
              <Input
                type="hidden"
                name="book_image"
                value={formData.book_image}
              />
            )}

            <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row pt-2 sm:pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {book ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{book ? "Update Book" : "Create Book"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
