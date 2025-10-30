import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import apiInstance from "@/lib/api";
import { useEffect, useState } from "react";
import CourseCard from "../CourseCard";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await apiInstance.get("/courses?featured=true");
        if (response.data.success) {
          // Map API data to match CourseCard props
          const mappedCourses = response.data.courses.reduce(
            (store, course) => {
              if (store[course.batch]) {
                store[course.batch].push({
                  ...course,
                });
              } else {
                store[course.batch] = [
                  {
                    ...course,
                  },
                ];
              }

              return store;
            },
            {}
          );

          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const renderSkeletonCards = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="pl-2 md:pl-4 basis-4/5 xs:basis-1/2 sm:basis-1/3 lg:basis-1/4 "
      >
        <div className="p-1">
          <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="p-0">
              <Skeleton className="aspect-video w-full" />
            </div>
            <div className="p-6 flex-grow">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="p-6 pt-0 mt-auto">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="pt-16 md:pt-24 pb-4 md:pb-8 bg-secondary/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4 font-primary">
            কোর্স সমূহ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            তোমার জন্য সেরা লার্নিং প্যাকেজগুলো!
          </p>
        </div>

        {loading && renderSkeletonCards()}
        {/* Courses Carousel */}
        {!loading && courses && Object.keys(courses).length > 0 ? (
          Object.keys(courses).map((batch) => (
            <div key={batch} className="mb-12">
              <div className="flex items-center mb-6 gap-2">
                <h3 className="text-2xl font-semibold text-primary">
                  <span className="text-secondary">{batch} </span> ব্যাচের
                  কোর্সসমূহ
                </h3>
              </div>
              <div className="relative ">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full max-w-6xl mx-auto"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {courses[batch].map((course) => (
                      <CarouselItem
                        key={course.course_id}
                        className="pl-2 md:pl-4 basis-4/5 xs:basis-1/2 sm:basis-1/3 lg:basis-1/4 hover:-translate-y-2 cursor-pointer duration-300 "
                      >
                        <div className="p-1">
                          <CourseCard course={course} />
                        </div>
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
            </div>
          ))
        ) : (
          <span className="text-muted-foreground text-center block">
            {" "}
            এই মুহূর্তে কোন ফিচার্ড কোর্স নেই, তবে খুব শীঘ্রই আসছে ...{" "}
          </span>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg" className="min-w-[200px]">
            সকল কোর্স দেখুন
          </Button>
        </div>
      </div>
    </section>
  );
}
