import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Book,
  BookOpen,
  Calendar,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import apiInstance from "@/lib/api";
export default function BookDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await apiInstance.get(`/book/${slug}`);
      if (response.data.success) {
        const bookData = response.data.book;
        setBook(bookData);

        // Fetch image as blob to bypass CORS
        if (bookData.book_image) {
          try {
            const imageResponse = await fetch(bookData.book_image);
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const objectUrl = URL.createObjectURL(blob);
              setImageUrl(objectUrl);
            }
          } catch (error) {
            console.error(
              `Failed to fetch image for ${bookData.title}:`,
              error
            );
          }
        }
      } else {
        toast.error("Book not found");
        navigate("/books");
      }
    } catch (error) {
      toast.error("Failed to load book details");
      console.error("Error fetching book details:", error);
      navigate("/books");
    } finally {
      setIsLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleOrderNow = () => {
    if (book) {
      navigate(`/checkout?book=${book.slug}`);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Book Title Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Responsive Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Desktop: Book Card on Left - Centered */}
              <div className="lg:col-span-1 lg:col-start-2 order-2 lg:order-1">
                <div className="sticky top-6">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="w-full aspect-square" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <Skeleton className="h-12 w-32 mx-auto" />
                      <Skeleton className="h-10 w-full" />
                      <div className="border-t border-border pt-4 space-y-3">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content - Empty for now as requested */}
              <div className="lg:col-span-2 order-1 lg:order-2"></div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Book Title - At the very top */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {book.title}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created: {new Date(book.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Desktop: Book Card on Left - Centered */}
            <div className="lg:col-span-1 lg:col-start-2 order-2 lg:order-1">
              <div className="sticky top-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {book.book_image && !imageError ? (
                        <img
                          src={imageUrl || book.book_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book className="w-24 h-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary mb-2">
                        ৳{book.price}
                      </p>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleOrderNow}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order Now
                      </Button>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <h3 className="font-semibold text-foreground mb-3">
                        Book Information
                      </h3>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Price
                        </span>
                        <span className="font-medium text-foreground">
                          ৳{book.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Type
                        </span>
                        <span className="font-medium text-foreground">
                          Physical Book
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Published
                        </span>
                        <span className="font-medium text-foreground">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content - Empty for now as requested */}
            <div className="lg:col-span-2 order-1 lg:order-2"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
