import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Loader2,
  Calendar,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  BarChart,
  ShoppingCart,
  Book,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy data for UI testing
const DUMMY_COURSE = {
  id: 1,
  course_title: "Physics Complete Course - HSC 27",
  price: 2500,
  thumbnail: null,
  batch: "HSC 27",
  language: "Bangla",
  created_at: "2024-01-15",
  description:
    "This comprehensive physics course covers all topics required for HSC 2027 examination. You'll learn fundamental concepts, solve complex problems, and prepare for your exams with confidence. The course includes video lectures, practice problems, and mock tests.",
  curriculum: [
    {
      title: "Mechanics",
      description: "Kinematics, dynamics, and energy concepts",
    },
    {
      title: "Thermodynamics",
      description: "Heat, temperature, and laws of thermodynamics",
    },
    {
      title: "Electromagnetism",
      description: "Electric fields, circuits, and magnetic fields",
    },
    { title: "Optics", description: "Light, lenses, and optical instruments" },
    {
      title: "Modern Physics",
      description: "Quantum mechanics and relativity basics",
    },
  ],
  instructor: {
    name: "Dr. Mohammad Rahman",
    bio: "PhD in Physics from BUET with 15+ years of teaching experience",
  },
  quiz_count: 25,
  assessment: true,
  expiry: 365,
  skill_level: "Intermediate",
};

const DUMMY_RELATED_BOOKS = [
  {
    id: 1,
    title: "HSC Physics Solved Problems",
    book_image: null,
    price: 450,
  },
  {
    id: 2,
    title: "Advanced Physics Concepts",
    book_image: null,
    price: 380,
  },
  {
    id: 3,
    title: "Physics Formula Handbook",
    book_image: null,
    price: 280,
  },
  {
    id: 4,
    title: "HSC Physics MCQ Bank",
    book_image: null,
    price: 320,
  },
];

const DUMMY_RELATED_COURSES = [
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
];

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    // Simulate API loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Using dummy data for UI testing
    setCourse(DUMMY_COURSE);
    setRelatedBooks(DUMMY_RELATED_BOOKS);
    setRelatedCourses(DUMMY_RELATED_COURSES);

    setIsLoading(false);
    // Comment out actual API calls for now
    // try {
    //   const [courseRes, booksRes, coursesRes] = await Promise.all([
    //     axiosInstance.get(`/courses/${id}`),
    //     axiosInstance.get(`/courses/${id}/related-books`),
    //     axiosInstance.get(`/courses/${id}/related-courses`)
    //   ]);
    //
    //   setCourse(courseRes.data);
    //   setRelatedBooks(booksRes.data);
    //   setRelatedCourses(coursesRes.data);
    // } catch (error) {
    //   toast.error('Failed to load course details');
    //   console.error('Error fetching course details:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleEnroll = () => {
    navigate(`/checkout?course=${id}`);
  };

  const handleOrderBook = (bookId) => {
    navigate(`/checkout?book=${bookId}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Course Title - At the very top */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {course.course_title}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{course.language || "Bangla"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created:{" "}
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Desktop: Course Card on Left */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-6">
                <Card className="overflow-hidden">
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
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary mb-2">
                        ৳{course.price}
                      </p>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleEnroll}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Enroll Now
                      </Button>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <h3 className="font-semibold text-foreground mb-3">
                        Course Information
                      </h3>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Quiz Count
                        </span>
                        <span className="font-medium text-foreground">
                          {course.quiz_count || 0}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Assessment
                        </span>
                        <span className="font-medium text-foreground">
                          {course.assessment ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Expiry
                        </span>
                        <span className="font-medium text-foreground">
                          {course.expiry ? `${course.expiry} days` : "Lifetime"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BarChart className="w-4 h-4" />
                          Skill Level
                        </span>
                        <span className="font-medium text-foreground capitalize">
                          {course.skill_level || "All Levels"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Language
                        </span>
                        <span className="font-medium text-foreground">
                          {course.language || "Bangla"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content - Tabs and Content */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
              {/* Tabs */}
              <div className="border-b border-border">
                <div className="flex gap-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "description"
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "curriculum"
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => setActiveTab("instructor")}
                    className={`pb-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "instructor"
                        ? "border-primary text-primary font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Instructor
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-card rounded-lg p-6 border border-border">
                {activeTab === "description" && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap">
                      {course.description ||
                        "No description available for this course."}
                    </p>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-3">
                    {course.curriculum && course.curriculum.length > 0 ? (
                      course.curriculum.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Curriculum details will be updated soon.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div className="space-y-4">
                    {course.instructor ? (
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-bold text-primary">
                            {course.instructor.name?.charAt(0) || "I"}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {course.instructor.name || "Instructor"}
                          </h3>
                          <p className="text-muted-foreground mt-1">
                            {course.instructor.bio ||
                              "Experienced educator dedicated to student success."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Instructor information will be updated soon.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Related Books */}
              {relatedBooks.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Related Books
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedBooks.map((book) => (
                      <Card
                        key={book.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
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
                                <Book className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-3">
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
                            {book.title}
                          </h4>
                          <p className="text-sm font-bold text-primary">
                            ৳{book.price}
                          </p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => handleOrderBook(book.id)}
                          >
                            Order
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Courses */}
              {relatedCourses.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Related Courses
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedCourses.map((relatedCourse) => (
                      <Card
                        key={relatedCourse.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleCourseClick(relatedCourse.id)}
                      >
                        <CardHeader className="p-0">
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            {relatedCourse.thumbnail ? (
                              <img
                                src={relatedCourse.thumbnail}
                                alt={relatedCourse.course_title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <h4 className="text-lg font-semibold text-foreground line-clamp-2 mb-2">
                            {relatedCourse.course_title}
                          </h4>
                          <p className="text-xl font-bold text-primary">
                            ৳{relatedCourse.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
