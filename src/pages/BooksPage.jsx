import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import apiInstance from "@/lib/api";
import { Book, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  const fetchBooks = async () => {
    try {
      const response = await apiInstance.get("/books");
      const booksData = response.data.books || [];
      setBooks(booksData);

      // Fetch images as blobs to bypass CORS
      for (const book of booksData) {
        if (book.book_image) {
          try {
            const imageResponse = await fetch(book.book_image);
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              const objectUrl = URL.createObjectURL(blob);
              setImageUrls((prev) => ({ ...prev, [book.slug]: objectUrl }));
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${book.title}:`, error);
          }
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load books");
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (bookId) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }));
  };

  const handleOrderNow = (bookSlug) => {
    navigate(`/books/${bookSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Books
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our collection of educational books to support your studies
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={`book-skeleton-${index}`}
                  className="overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <Skeleton className="w-full aspect-square" />
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {" "}
              {books.length === 0 ? (
                <div className="text-center py-16">
                  <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No books available at the moment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <Card
                      key={book.slug}
                      className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <CardHeader className="p-0">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          {book.book_image && !imageErrors[book.slug] ? (
                            <img
                              src={imageUrls[book.slug] || book.book_image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(book.slug)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Book className="w-16 h-16 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                          {book.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            ৳{book.price}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => handleOrderNow(book.slug)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
