import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { BookOpen, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
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

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      setActiveFilter("all"); // Reset to all when searching
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter !== "all") {
      setSearchTerm(""); // Reset search when filtering
    }
  };

  // Filter and search books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !searchTerm ||
      book.title
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      book.batch
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      book.writter
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim());

    const matchesFilter = activeFilter === "all" || book.batch === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Group filtered books by batch
  const groupedBooks = filteredBooks.reduce((acc, book) => {
    const batch = book.batch || "Other";
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(book);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <motion.main
        className="flex-1 container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Books
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our collection of educational books to support your studies
            </p>
          </motion.div>

          {isLoading ? (
            <>
              {/* Search and Filter Skeleton */}
              <div className="space-y-8 mb-8">
                <div className="flex justify-start">
                  <Skeleton className="h-12 mx-auto w-full max-w-lg rounded-xl" />
                </div>
                <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-24 rounded-lg" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={`book-skeleton-${index}`} className="space-y-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <div className="space-y-3 p-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Search and Filter */}
              {books.length > 0 && (
                <motion.div
                  className="space-y-8 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* Search Bar */}
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-lg">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Search className="w-5 h-5 text-primary/80" />
                      </div>
                      <Input
                        placeholder="Search books by title, author, or batch..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-12 pr-4 py-3 h-12 text-base bg-card border-1 border-accent/30 rounded-xl shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
                      />
                      {searchTerm && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            onClick={() => handleSearchChange("")}
                            className="p-1 hover:bg-accent rounded-full transition-colors"
                          >
                            <span className="sr-only">Clear search</span>
                            <svg
                              className="w-4 h-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex justify-center gap-2 sm:gap-3 flex-wrap max-w-3xl mx-auto">
                    <Button
                      variant={activeFilter === "all" ? "default" : "outline"}
                      onClick={() => handleFilterChange("all")}
                      className="min-w-[100px] h-10 rounded-lg font-medium transition-all duration-200"
                    >
                      All Books
                    </Button>
                    {batches.map((batch) => (
                      <Button
                        key={batch}
                        variant={activeFilter === batch ? "default" : "outline"}
                        onClick={() => handleFilterChange(batch)}
                        className="min-w-[100px] h-10 rounded-lg font-medium transition-all duration-200"
                      >
                        {batch}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {books.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No books available at the moment
                  </p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No books found matching your search criteria
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedBooks).map(
                    ([batch, batchBooks], index) => (
                      <motion.div
                        key={batch}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-primary">
                            <span className="text-secondary">{batch}</span>{" "}
                            Books
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                          {batchBooks.map((book) => (
                            <BookCard
                              key={book.book_id || book.slug}
                              book={book}
                              className="hover:scale-105 transition-transform duration-300 select-none cursor-pointer"
                            />
                          ))}
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
