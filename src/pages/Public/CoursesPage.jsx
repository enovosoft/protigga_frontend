import CourseCard from "@/components/CourseCard";
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
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourses();
  }, []);

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

  // Filter and search courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.batch?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || course.batch === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Group filtered courses by batch
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const batch = course.batch || "Other";
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(course);
    return acc;
  }, {});

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
            {/* Search Skeleton */}
            <div className="space-y-6 mb-12">
              <div className="flex justify-start">
                <Skeleton className="h-10 w-full max-w-md  mx-auto rounded-lg" />
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-24 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="space-y-3 p-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
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
              Explore Our Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover a wide range of courses designed to help you achieve your
              learning goals
            </p>
          </motion.div>

          {/* Search and Filter */}
          {courses.length > 0 && (
            <motion.div
              className="space-y-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Enhanced Search Bar */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="w-5 h-5 text-primary/80" />
                  </div>
                  <Input
                    placeholder="Search courses by title or batch..."
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
                  All Courses
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

          {courses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No courses available at the moment
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No courses found matching your search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedCourses).map(
                ([batch, batchCourses], index) => (
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
                        <span className="text-secondary">{batch}</span> Batch
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {batchCourses.map((course) => (
                        <CourseCard
                          key={course.course_id || course.id}
                          course={course}
                          className="transition-transform duration-200 hover:-translate-y-1 select-none cursor-pointer"
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
