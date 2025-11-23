import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ImageFallback from "@/components/shared/ImageFallback";
import PDFViewer from "@/components/shared/PDFViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import apiInstance from "@/lib/api";
import { BookOpen, Eye, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
export default function BookDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiInstance.get(`/book/${slug}`);
      if (response.data.success) {
        const bookData = response.data.book;
        setBook({
          ...bookData,
        });
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
    window.scrollTo(0, 0);
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleOrderNow = () => {
    if (book) {
      navigate(`/checkout?book=${book.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoading && !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  return (
    <>
      <Helmet key={book?.slug}>
        <title>
          {book?.title
            ? `${book.title} - প্রতিজ্ঞা`
            : "বই বিস্তারিত - প্রতিজ্ঞা"}
        </title>
        <meta
          name="description"
          content={
            book?.description
              ? `${book.description.substring(0, 160)}...`
              : "প্রতিজ্ঞার শিক্ষামূলক বই বিস্তারিত তথ্য। HSC, SSC এবং বিভিন্ন প্রতিযোগিতামূলক পরীক্ষার জন্য মানসম্পন্ন বই।"
          }
        />
        <meta
          property="og:title"
          content={
            book?.title
              ? `${book.title} - প্রতিজ্ঞা`
              : "বই বিস্তারিত - প্রতিজ্ঞা"
          }
        />
        <meta
          property="og:description"
          content={
            book?.description
              ? `${book.description.substring(0, 160)}...`
              : "প্রতিজ্ঞার শিক্ষামূলক বই বিস্তারিত তথ্য।"
          }
        />
        <meta property="og:image" content={book?.book_image || "/logo.png"} />
        <meta
          property="og:url"
          content={`https://www.protigya.com/books/${book?.slug || ""}`}
        />
        <link
          rel="canonical"
          href={`https://www.protigya.com/books/${book?.slug || ""}`}
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        {isLoading ? (
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
        ) : !book ? (
          <main className="flex-1 flex items-center justify-center px-4 py-16">
            <p className="text-muted-foreground">Book not found</p>
          </main>
        ) : (
          <motion.main
            className="flex-1 container mx-auto px-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Left Side - Image */}
                <motion.div
                  className="order-1 lg:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="sticky top-6">
                    <Card className="overflow-hidden relative">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden bg-muted aspect-auto">
                          <ImageFallback
                            src={book.book_image}
                            alt={book.title}
                            className="w-full h-auto transition-transform duration-300 hover:scale-105 cursor-zoom-in object-contain"
                          />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            <BookOpen className="w-3 h-3" />
                            {book.batch}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
                              book.stock > 20
                                ? "bg-green-500 text-white"
                                : book.stock > 0
                                ? "bg-yellow-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {book.stock > 20
                              ? "In Stock"
                              : book.stock > 0
                              ? `Only ${book.stock} left`
                              : "Out of Stock"}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                </motion.div>

                {/* Right Side - Content */}
                <motion.div
                  className="order-2 lg:order-2 space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Title */}
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
                      {book.title}
                    </h1>
                  </div>

                  {/* Price and Author */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <span className="text-2xl md:text-3xl font-bold text-primary">
                      ৳{book.price}
                    </span>
                    <span className="text-sm md:text-base text-muted-foreground">
                      by{" "}
                      <span className="font-medium">
                        {book.writter || "Unknown"}
                      </span>
                    </span>
                  </div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Card className="shadow-sm">
                      <CardContent className="pt-6 px-4 sm:px-6">
                        <div className="prose prose-sm sm:prose-base max-w-none">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-primary text-sm sm:text-base">
                            {book.description ||
                              "No description available for this book."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleOrderNow}
                      disabled={book.stock === 0}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {book.stock === 0 ? "Out of Stock" : "Order Now"}
                    </Button>

                    {book.demo_file_link && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outlineFill"
                            className="w-full"
                            size="lg"
                          >
                            <Eye className="w-5 h-5 mr-2" />
                            Show Demo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw]">
                          <DialogHeader className="flex-shrink-0">
                            <DialogTitle className="text-lg sm:text-xl">
                              {book.title} - Demo
                            </DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">
                              Preview of the book content
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex-1 overflow-y-auto min-h-0">
                            <PDFViewer
                              link={book.demo_file_link}
                              title={`${book.title} Demo`}
                              isBasicControl={true}
                              initialScale={0.8}
                              disableScaling={false}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.main>
        )}

        <Footer />
      </div>
    </>
  );
}
