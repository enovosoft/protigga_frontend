import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { scrollAppear, scrollFadeInRight } from "@/lib/animations";
import api from "@/lib/api";
import { Info } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../BookCard";

export default function FeaturedBooks() {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await api.get("/books?featured=true");
        if (response.data.success) {
          const mappedBooks = response.data.books?.reduce((store, book) => {
            if (store[book.batch]) {
              store[book.batch].push({
                ...book,
              });
            } else {
              store[book.batch] = [
                {
                  ...book,
                },
              ];
            }

            return store;
          }, {});

          setBooks(mappedBooks);
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
    return (
      <div className="space-y-12 mx-auto">
        {/* Skeleton for batch sections */}
        {Array.from({ length: 2 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6">
            {/* Batch title skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-52" />
            </div>

            {/* Cards carousel skeleton */}
            <div className="relative">
              <div className="flex gap-2 md:gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[280px] xs:w-[240px] sm:w-[260px] lg:w-[240px]"
                  >
                    <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col shadow-sm">
                      <div className="p-0 relative">
                        <Skeleton className="aspect-square w-full rounded-t-lg" />
                        {/* Batch tag skeleton */}
                        <div className="absolute top-3 right-3">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        {/* Stock status skeleton */}
                        <div className="absolute top-3 left-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                      <div className="p-4 flex-grow space-y-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex items-center justify-start mt-3">
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Navigation button skeletons */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-10">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-10">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}

        {/* View all button skeleton */}
        <div className="text-center mt-12">
          <Skeleton className="h-12 w-48 mx-auto rounded-md" />
        </div>
      </div>
    );
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
        {loading && (
          <div className="animate-pulse">{renderSkeletonCards()}</div>
        )}
        {/* Books Carousel */}
        {!loading && books && Object.keys(books).length > 0
          ? Object.keys(books).map((batch) => (
              <motion.div key={batch} className="mb-12" {...scrollAppear}>
                <div className="flex items-center mb-6 gap-2">
                  <h3 className="text-2xl font-semibold text-primary">
                    <span className="text-secondary">{batch} </span> ব্যাচের
                    সেরা বইসমূহ
                  </h3>
                </div>
                <div className="relative ">
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full max-w-6xl mx-auto"
                  >
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {books[batch].map((book) => (
                        <CarouselItem
                          key={book.book_id}
                          className="pl-2 md:pl-4 basis-4/5 xs:basis-1/2 sm:basis-1/3 lg:basis-1/4 hover:-translate-y-2 cursor-pointer duration-300 "
                        >
                          <motion.div className="p-1" {...scrollFadeInRight}>
                            <BookCard book={book} />
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {
                      <CarouselPrevious className="flex h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg -left-4 md:-left-10" />
                    }
                    {
                      <CarouselNext className="flex h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg -right-4 md:-right-10" />
                    }
                  </Carousel>
                </div>
              </motion.div>
            ))
          : !loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Info className="mx-auto mb-4 h-8 w-8 text-primary" />
                <p className="text-primary text-center">
                  এই মুহূর্তে কোন ফিচার্ড বই নেই, তবে খুব শীঘ্রই আসছে ...
                </p>
              </div>
            )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="secondary"
            size="lg"
            className="min-w-[200px]"
            onClick={() => navigate("/books")}
          >
            সকল বই দেখুন
          </Button>
        </div>
      </div>
    </section>
  );
}
