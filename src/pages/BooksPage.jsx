import { useState, useEffect } from "react";
import { Book, Loader2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy data for UI testing
const DUMMY_BOOKS = [
  {
    id: 1,
    title: "HSC Physics Complete Guide",
    book_image: null,
    price: 450,
  },
  {
    id: 2,
    title: "Advanced Chemistry Problems",
    book_image: null,
    price: 380,
  },
  {
    id: 3,
    title: "Mathematics Formula Handbook",
    book_image: null,
    price: 280,
  },
  {
    id: 4,
    title: "Biology MCQ Bank",
    book_image: null,
    price: 320,
  },
  {
    id: 5,
    title: "English Grammar & Composition",
    book_image: null,
    price: 350,
  },
  {
    id: 6,
    title: "Bangla Literature Analysis",
    book_image: null,
    price: 300,
  },
  {
    id: 7,
    title: "ICT Practical Guide",
    book_image: null,
    price: 250,
  },
  {
    id: 8,
    title: "HSC Mock Test Papers",
    book_image: null,
    price: 400,
  },
];

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    // Simulate API loading delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Using dummy data for UI testing
    setBooks(DUMMY_BOOKS);
    setIsLoading(false);

    // Comment out actual API call for now
    // try {
    //   const response = await axiosInstance.get('/books');
    //   setBooks(response.data);
    // } catch (error) {
    //   toast.error('Failed to load books');
    //   console.error('Error fetching books:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleOrderNow = (bookId) => {
    // Navigate to checkout or add to cart
    toast.success("Book added to cart!");
    // navigate(`/checkout?book=${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  key={book.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      {book.book_image ? (
                        <img
                          src={book.book_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
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
                      onClick={() => handleOrderNow(book.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
