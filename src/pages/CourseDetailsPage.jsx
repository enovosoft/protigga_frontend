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
import {
  DUMMY_COURSE,
  DUMMY_RELATED_BOOKS,
  DUMMY_RELATED_COURSES,
} from "@/config/data";
import api from "@/lib/api";
import { cleanupImageUrls, fetchImageAsBlob } from "@/lib/helper";
import {
  BarChart,
  Book,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Play,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});

  const fetchCourseDetails = useCallback(async () => {
    try {
      const response = await api.get(`/course/${slug}`);
      if (response.data.success && response.data.course) {
        const courseData = response.data.course;
        const courseInfo = {
          id: courseData.id,
          course_id: courseData.course_id,
          course_title: courseData.course_title,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          batch: courseData.batch,
          slug: courseData.slug,
          language: courseData.course_details?.language || "Bangla",
          description: courseData.course_details?.description || "",
          quiz_count: courseData.course_details?.quiz_count || 0,
          assessment: courseData.course_details?.assessment || false,
          skill_level: courseData.course_details?.skill_level || "Beginner",
          expired_date: courseData.course_details?.expired_date,
          academy_name: courseData.course_details?.academy_name || "",
          curriculum: DUMMY_COURSE.curriculum, // Use dummy curriculum for now
          instructor: DUMMY_COURSE.instructor, // Use dummy instructor for now
        };

        setCourse(courseInfo);

        // Load image if available
        if (courseData.thumbnail) {
          const blobUrl = await fetchImageAsBlob(courseData.thumbnail);
          if (blobUrl) {
            setImageUrl(blobUrl);
          }
        }
      } else {
        // Use dummy data for development
        setCourse(DUMMY_COURSE);
        setRelatedBooks(DUMMY_RELATED_BOOKS);
        setRelatedCourses(DUMMY_RELATED_COURSES);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      // Use dummy data for development
      setCourse(DUMMY_COURSE);
      setRelatedBooks(DUMMY_RELATED_BOOKS);
      setRelatedCourses(DUMMY_RELATED_COURSES);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        cleanupImageUrls({ courseImage: imageUrl });
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = () => {
    navigate(`/checkout?course=${slug}`);
  };

  const handleOrderBook = (bookId) => {
    navigate(`/checkout?book=${bookId}`);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    window.scrollTo(0, 0);
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const getTopicIcon = (type) => {
    return <Play className="w-4 h-4 text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
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
                <span>{course.academy_name}</span>
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
                      {imageUrl && !imageError ? (
                        <img
                          src={imageUrl}
                          alt={course.course_title}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
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
                            <XCircle className="w-4 h-4 text-destructive" />
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
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {course.description ||
                        "No description available for this course."}
                    </p>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    {course.curriculum && course.curriculum.length > 0 ? (
                      course.curriculum.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">
                                {chapter.chapter}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {chapter.topics.length} topics
                              </span>
                              {expandedChapters[chapter.id] ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </button>

                          {expandedChapters[chapter.id] && (
                            <div className="border-t border-border">
                              {chapter.topics.map((topic, index) => (
                                <div
                                  key={topic.id}
                                  className={`flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors ${
                                    index !== chapter.topics.length - 1
                                      ? "border-b border-border/50"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    {getTopicIcon(topic.type)}
                                    <span className="text-sm font-medium text-foreground">
                                      {topic.title}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">
                          Curriculum details will be updated soon.
                        </p>
                      </div>
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
