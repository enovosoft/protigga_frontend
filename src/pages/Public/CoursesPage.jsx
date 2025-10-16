import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { cleanupImageUrls, fetchImageAsBlob } from "@/lib/helper";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      cleanupImageUrls(imageUrls);
    };
  }, [imageUrls]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        const coursesData = response.data.courses || [];
        setCourses(coursesData);

        // Extract unique batches
        const uniqueBatches = [
          ...new Set(coursesData.map((course) => course.batch)),
        ].filter(Boolean);
        setBatches(uniqueBatches);

        // Load images asynchronously in the background (non-blocking)
        coursesData.forEach(async (course) => {
          if (course.thumbnail) {
            try {
              const blobUrl = await fetchImageAsBlob(course.thumbnail);
              if (blobUrl) {
                setImageUrls((prev) => ({
                  ...prev,
                  [course.slug || course.id]: blobUrl,
                }));
              }
            } catch (error) {
              console.error(
                `Failed to load image for course ${course.course_title}:`,
                error
              );
            }
          }
        });
      } else {
        toast.error("Failed to load courses");
      }
    } catch (error) {
      toast.error("Failed to load courses");
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (courseId) => {
    setImageErrors((prev) => ({ ...prev, [courseId]: true }));
  };

  const handleEnroll = (slug) => {
    navigate(`/courses/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="aspect-video w-full" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
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
              Explore Our Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover a wide range of courses designed to help you achieve your
              learning goals
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No courses available at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {batches.map((batch) => {
                const batchCourses = courses.filter(
                  (course) => course.batch === batch
                );
                return (
                  <div key={batch} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground">
                        {batch} Batch
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batchCourses.map((course) => (
                        <Card
                          key={course.id || course.course_id}
                          className="overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <CardHeader className="p-0">
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              {imageUrls[course.slug || course.id] &&
                              !imageErrors[course.slug || course.id] ? (
                                <img
                                  src={imageUrls[course.slug || course.id]}
                                  alt={course.course_title}
                                  className="w-full h-full object-cover"
                                  onError={() =>
                                    handleImageError(course.slug || course.id)
                                  }
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="w-12 h-12 text-muted-foreground" />
                                </div>
                              )}
                              {/* Batch Tag */}
                              {course.batch && (
                                <div className="absolute top-3 right-3">
                                  <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                    <BookOpen className="w-3 h-3" />
                                    {course.batch}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                              {course.course_title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-primary">
                                ৳{course.price}
                              </span>
                            </div>
                          </CardContent>

                          <CardFooter className="p-6 pt-0">
                            <Button
                              className="w-full"
                              onClick={() => handleEnroll(course.slug)}
                            >
                              Enroll Now
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
