import FileUpload from "@/components/shared/FileUpload";
import ImageFallback from "@/components/shared/ImageFallback";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/lib/api";
import { Book, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const bookSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 200 characters long"),
  price: z.coerce
    .number("Price is required")
    .min(0, "Price must be a positive number"),

  book_image: z
    .string("Book image is required")
    .url("Book image must be a valid URL"),
  writter: z
    .string("Writer name is required")
    .min(3, "Writer name must be at least 3 characters long")
    .max(100, "Writer name must be at most 100 characters long"),
  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  batch: z
    .string("Batch is required")
    .min(2, "Batch must be at least 2 characters long"),
  is_featured: z.boolean(),
  stock: z.coerce
    .number("Stock is required")
    .min(0, "Stock must be a positive number"),
  demo_file_link: z
    .string("Demo file link is required")
    .url("Demo file link must be a valid URL"),
});

const initialFormData = {
  title: "",
  price: "",
  book_image: "",
  writter: "",
  description: "",
  batch: "",
  is_featured: false,
  stock: "",
  demo_file_link: "",
};
export default function BookDialog({ open, onOpenChange, book, onSuccess }) {
  const [formData, setFormData] = useState({ ...initialFormData });

  const [loading, setLoading] = useState(false);
  const [fetchingBook, setFetchingBook] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    if (!book?.slug) return;

    setFetchingBook(true);
    try {
      const response = await api.get(`/book/${book.slug}`);
      if (response.data.success && response.data.book) {
        const bookData = response.data.book;
        setFormData({
          title: bookData.title || "",
          price: bookData.price || 0,
          book_image: bookData.book_image || "",
          writter: bookData.writter || "",
          description: bookData.description || "",
          batch: bookData.batch || "",
          is_featured: bookData.is_featured || false,
          stock: bookData.stock || 1,
          demo_file_link: bookData.demo_file_link || "",
        });
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      toast.error("Failed to fetch book details");
      // Fallback to the passed book data
      setFormData({
        title: book.title || "",
        price: book.price || 0,
        book_image: book.book_image || "",
        writter: book.writter || "",
        description: book.description || "",
        batch: book.batch || "",
        is_featured: book.is_featured || false,
        stock: book.stock || 1,
        demo_file_link: book.demo_file_link || "",
      });
    } finally {
      setFetchingBook(false);
    }
  }, [book]);

  // Fetch book details when editing
  useEffect(() => {
    if (book && open) {
      fetchBookDetails();
    } else if (!book) {
      setFormData({
        ...initialFormData,
      });
    }
  }, [book, open, fetchBookDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      book_image: url,
    }));
  };

  const handleDemoFileUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      demo_file_link: url,
    }));
  };

  const handleToggleChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      is_featured: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    let validationResult = bookSchema.safeParse(formData);

    console.log("Validation Result:", validationResult);
    if (!validationResult.success) {
      toast.error(
        validationResult.error?.issues[0].message ||
          "Validation errors found. Please check the form."
      );
      return;
    }

    setLoading(true);

    try {
      let response;

      const payload = {
        ...validationResult.data,
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
          response.data.message || book
            ? "Book updated successfully!"
            : "Book created successfully!"
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

          {fetchingBook ? (
            <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden">
              {/* Skeleton for current book image section */}
              <div className="p-2.5 sm:p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden w-full">
                <Skeleton className="h-4 w-32 mb-2" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-16 sm:w-16 sm:h-20 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-3 w-48 mt-2" />
              </div>

              {/* Skeleton for title input */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 sm:h-11 w-full" />
              </div>

              {/* Skeleton for price and writer inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 sm:h-11 w-full" />
                </div>
              </div>

              {/* Skeleton for description textarea */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 sm:h-24 w-full" />
              </div>

              {/* Skeleton for file upload */}
              <div className="overflow-hidden p-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-5 mt-3 sm:mt-4 overflow-x-hidden"
            >
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <Label htmlFor="title" className="text-sm font-medium">
                  Book Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="HSC Physics Formula Book"
                  className="w-full h-10 sm:h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-hidden p-1">
                {" "}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price (BDT) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="599"
                    className="w-full h-10 sm:h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 overflow-hidden p-1">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium">
                    Stock: <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="writer" className="text-sm font-medium">
                    Writer <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="writer"
                    name="writter"
                    value={formData.writter}
                    onChange={handleChange}
                    placeholder="মোমেন তাজোয়ার মমিত"
                    className="w-full h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="batch" className="text-sm font-medium">
                    Batch <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="HSC 26"
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
                  placeholder="A compact,  guide packed with every essential formula you need to ace your HSC Physics exams. Clear, concise, and perfect for last-minute revision — because sometimes, all you need is the formula."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-solid border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              {/* Is Featured Toggle */}
              <div className="space-y-1.5 sm:space-y-2 overflow-hidden p-1">
                <div className="flex gap-4">
                  <Label htmlFor="is_featured" className="text-sm font-medium">
                    Featured Book
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_featured"
                            checked={formData.is_featured}
                            onCheckedChange={handleToggleChange}
                          />
                          <span className="text-sm text-muted-foreground">
                            {formData.is_featured ? "Featured" : "Not Featured"}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Whether book should be displayed on home page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="overflow-hidden p-1">
                <FileUpload
                  label={
                    <span>
                      Upload Book Image{" "}
                      <span className="text-destructive">*</span>
                    </span>
                  }
                  accept=".jpg,.jpeg,.png,.webp"
                  supportedTypes="Images"
                  autoUpload={true}
                  onUploadSuccess={handleCoverImageUpload}
                />
              </div>

              {formData.book_image && (
                <Input
                  type="hidden"
                  name="book_image"
                  value={formData.book_image}
                />
              )}
              {/* Show existing book image when editing */}
              {book && book.book_image && (
                <div className="p-2.5 sm:p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden w-full">
                  <Label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">
                    Current Book Image:
                  </Label>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="overflow-hidden w-full">
                      <ImageFallback
                        alt="Current Book Image"
                        src={book.book_image}
                        className="object-cover max-w-40  aspect-auto rounded-md border border-solid border-border"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                    Upload a new image below to replace the current one
                  </p>
                </div>
              )}

              <div className="overflow-hidden p-1">
                <FileUpload
                  label={
                    <span>
                      Upload Demo File Link{" "}
                      <span className="text-destructive">*</span>
                    </span>
                  }
                  accept=".pdf"
                  supportedTypes="PDF Documents"
                  autoUpload={true}
                  onUploadSuccess={handleDemoFileUpload}
                />
              </div>

              {formData.demo_file_link && (
                <Input
                  type="hidden"
                  name="demo_file_link"
                  value={formData.demo_file_link}
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
