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

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ImageFallback from "@/components/shared/ImageFallback";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await apiInstance.get("/books");
      const booksData = response.data.books || [];
      setBooks(booksData);
      // extract unique batches and preserve order
      const uniqueBatches = Array.from(
        new Set(booksData.map((b) => b.batch).filter(Boolean))
      );
      setBatches(uniqueBatches);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load books");
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
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
              {/* Filter controls */}
              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                <button
                  className={`px-4 py-2 rounded-md font-medium ${
                    activeFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent border border-border"
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Books
                </button>
                {batches.map((batch) => (
                  <button
                    key={batch}
                    className={`px-4 py-2 rounded-md font-medium ${
                      activeFilter === batch
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent border border-border"
                    }`}
                    onClick={() => setActiveFilter(batch)}
                  >
                    {batch}
                  </button>
                ))}
              </div>

              {books.length === 0 ? (
                <div className="text-center py-16">
                  <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No books available at the moment
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {activeFilter === "all"
                    ? batches.map((batch) => {
                        const batchBooks = books.filter(
                          (b) => b.batch === batch
                        );
                        if (!batchBooks.length) return null;
                        return (
                          <div key={batch}>
                            <h2 className="text-2xl font-semibold mb-4">
                              {batch}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {batchBooks.map((book) => (
                                <Card
                                  key={book.slug}
                                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                                >
                                  <CardHeader className="p-0 relative">
                                    <div className="relative aspect-auto overflow-hidden bg-muted">
                                      <ImageFallback
                                        src={book.book_image}
                                        alt={book.title}
                                      />
                                      {book.batch && (
                                        <div className="absolute top-3 right-3">
                                          <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                            <BookOpen className="w-3 h-3" />
                                            {book.batch}
                                          </span>
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
                                    {book.stock === 0 ? (
                                      <button
                                        disabled
                                        className="w-full bg-muted text-muted-foreground py-2 rounded-md cursor-not-allowed"
                                      >
                                        Stock Out
                                      </button>
                                    ) : (
                                      <Link
                                        to={`/books/${book.slug}`}
                                        className="w-full"
                                      >
                                        <Button className="w-full">
                                          <ShoppingCart className="w-4 h-4 mr-2" />
                                          Order Now
                                        </Button>
                                      </Link>
                                    )}
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    : (() => {
                        const filtered = books.filter(
                          (b) => b.batch === activeFilter
                        );
                        return (
                          <div>
                            <h2 className="text-2xl font-semibold mb-4">
                              {activeFilter}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {filtered.map((book) => (
                                <Card
                                  key={book.slug}
                                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                                >
                                  <CardHeader className="p-0 relative">
                                    <div className="relative aspect-auto overflow-hidden bg-muted">
                                      <ImageFallback
                                        src={book.book_image}
                                        alt={book.title}
                                      />
                                      {book.batch && (
                                        <div className="absolute top-3 right-3">
                                          <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                            <BookOpen className="w-3 h-3" />
                                            {book.batch}
                                          </span>
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
                                    {book.stock === 0 ? (
                                      <button
                                        disabled
                                        className="w-full bg-muted text-muted-foreground py-2 rounded-md cursor-not-allowed"
                                      >
                                        Stock Out
                                      </button>
                                    ) : (
                                      <Link
                                        to={`/books/${book.slug}`}
                                        className="w-full"
                                      >
                                        <Button className="w-full">
                                          <ShoppingCart className="w-4 h-4 mr-2" />{" "}
                                          Order Now
                                        </Button>
                                      </Link>
                                    )}
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
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
