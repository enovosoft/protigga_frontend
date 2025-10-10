import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Book, ShoppingCart } from "lucide-react";
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
  const [imageAspectRatio, setImageAspectRatio] = useState("square");

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await apiInstance.get(`/course/${slug}`);
      if (response.data.success) {
        const courseData = response.data.course;
        setBook({
          id: courseData.id,
          course_id: courseData.course_id,
          title: courseData.course_title,
          price: courseData.price,
          book_image: courseData.thumbnail,
          slug: courseData.slug,
          description: courseData.course_details?.description || "",
          writter:
            courseData.course_details?.academy_name || "Protigga Academy",
          language: courseData.course_details?.language || "Bangla",
          batch: courseData.batch,
          createdAt: courseData.createdAt,
          updatedAt: courseData.updatedAt,
        });

        // Fetch image as blob to bypass CORS and detect dimensions
        if (courseData.thumbnail) {
          try {
            const imageResponse = await fetch(courseData.thumbnail);
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const objectUrl = URL.createObjectURL(blob);
              setImageUrl(objectUrl);

              // Detect image dimensions for aspect ratio
              const img = new Image();
              img.onload = () => {
                const aspectRatio = img.width / img.height;
                if (aspectRatio > 1.2) {
                  setImageAspectRatio("video"); // Landscape
                } else if (aspectRatio < 0.8) {
                  setImageAspectRatio("portrait"); // Portrait
                } else {
                  setImageAspectRatio("square"); // Square
                }
                URL.revokeObjectURL(objectUrl);
              };
              img.src = objectUrl;
            }
          } catch (error) {
            console.error(
              `Failed to fetch image for ${courseData.course_title}:`,
              error
            );
          }
        }
      } else {
        toast.error("Course not found");
        navigate("/courses");
      }
    } catch (error) {
      toast.error("Failed to load course details");
      console.error("Error fetching course details:", error);
      navigate("/courses");
    } finally {
      setIsLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleOrderNow = () => {
    if (book) {
      navigate(`/checkout?course=${book.slug}`);
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
            {/* Course Title Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-10 w-64 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Responsive Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Left Side - Image Skeleton */}
              <div className="order-1 lg:order-1">
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="w-full aspect-square" />
                  </CardHeader>
                </Card>
              </div>

              {/* Right Side - Content Skeleton */}
              <div className="order-2 lg:order-2 space-y-6">
                {/* Title Skeleton */}
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                </div>

                {/* Price and Author Skeleton */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {/* Description Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>

                {/* Button Skeleton */}
                <Skeleton className="h-12 w-full" />
              </div>
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
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <div className="order-1 lg:order-1">
              <div className="sticky top-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div
                      className={`relative overflow-hidden bg-muted ${
                        imageAspectRatio === "video"
                          ? "aspect-video"
                          : imageAspectRatio === "portrait"
                          ? "aspect-[3/4]"
                          : "aspect-square"
                      }`}
                    >
                      {book.book_image && !imageError ? (
                        <img
                          src={imageUrl || book.book_image}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-zoom-in"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book className="w-24 h-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-2 lg:order-2 space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {book.title}
                </h1>
              </div>

              {/* Price and Author */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  ৳{book.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  by {book.writter || "Unknown"}
                </span>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-foreground">
                    Description
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {book.description ||
                        "No description available for this book."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Button */}
              <Button className="w-full" size="lg" onClick={handleOrderNow}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
