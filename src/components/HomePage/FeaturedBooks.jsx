import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import BookCard from "../BookCard";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await api.get("/books?featured=true");
        if (response.data.success) {
          setBooks(response.data.books || []);
        }
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  const renderSkeletonCards = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <CarouselItem
        key={index}
        className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
      >
        <div className="p-1">
          <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-0">
              <Skeleton className="aspect-video w-full" />
            </div>
            <div className="p-6 flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="p-6 pt-0 mt-auto">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </CarouselItem>
    ));
  };

  return (
    <section className="pt-16 md:pt-24 pb-4 md:pb-8  bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4 font-primary">
            বই সমূহ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            তোমার জন্য প্রয়োজনীয় সেরা বইগুলো!
          </p>
        </div>

        {/* Books Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4 justify-center items-center">
              {loading
                ? renderSkeletonCards()
                : books.map((book) => (
                    <CarouselItem
                      key={book.book_id}
                      className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <BookCard book={book} />
                      </div>
                    </CarouselItem>
                  ))}
              {!loading && books.length === 0 && (
                <div>
                  <Info className="mx-auto mb-4 h-8 w-8 text-primary" />
                  <p className="text-primary text-center">
                    Featured books are coming soon checkout our all books.
                  </p>
                </div>
              )}
            </CarouselContent>
            {!loading && books.length > 0 && (
              <>
                <CarouselPrevious className="flex h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg -left-4 md:-left-10" />
                <CarouselNext className="flex h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg -right-4 md:-right-10" />
              </>
            )}
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg" className="min-w-[200px]">
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
}
