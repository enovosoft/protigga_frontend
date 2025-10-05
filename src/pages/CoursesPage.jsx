import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2, Tag } from "lucide-react";
import toast from "react-hot-toast";
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
const DUMMY_COURSES = [
  {
    id: 1,
    course_title: "Physics Complete Course - HSC 27",
    price: 2500,
    thumbnail: null,
    batch: "HSC 27",
  },
  {
    id: 2,
    course_title: "Chemistry Crash Course - HSC 27",
    price: 2200,
    thumbnail: null,
    batch: "HSC 27",
  },
  {
    id: 3,
    course_title: "Mathematics Advanced - HSC 27",
    price: 2800,
    thumbnail: null,
    batch: "HSC 27",
  },
  {
    id: 4,
    course_title: "Biology Complete Guide - HSC 27",
    price: 2400,
    thumbnail: null,
    batch: "HSC 27",
  },
  {
    id: 5,
    course_title: "Physics Revision Course - HSC 26",
    price: 1800,
    thumbnail: null,
    batch: "HSC 26",
  },
  {
    id: 6,
    course_title: "Mathematics Problem Solving - HSC 26",
    price: 2000,
    thumbnail: null,
    batch: "HSC 26",
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    // Simulate API loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Using dummy data for UI testing
    setCourses(DUMMY_COURSES);
    setIsLoading(false);
    // Comment out actual API call for now
    // try {
    //   const response = await axiosInstance.get("/courses");
    //   setCourses(response.data);
    // } catch (error) {
    //   toast.error("Failed to load courses");
    //   console.error("Error fetching courses:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleEnroll = (courseId) => {
    navigate(`/courses/${courseId}`);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.course_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      {course.batch && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            <Tag className="w-3 h-3" />
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
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now
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
