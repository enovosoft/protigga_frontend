import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { INSTRUCTORS } from "@/config/data";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import {
  Award,
  BarChart,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Play,
  ShoppingCart,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});

  const fetchCourseDetails = useCallback(async () => {
    setIsLoadingCourse(true);
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
          curriculum: courseData.chapters || [], // Use real chapters from API
          instructor: {
            name: "Programming Instructor",
            subject: "Computer Science",
            experience: "8 years",
            students: 1500,
            image: null,
            bio: "Experienced programming instructor with expertise in multiple programming languages and frameworks. Dedicated to helping students build strong foundations in software development and problem-solving skills.",
          }, // Custom instructor for this course
        };

        setCourse(courseInfo);

        // Load image if available - removed fetchImageAsBlob
      } else {
        console.error("Course not found");
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setCourse(null);
    } finally {
      setIsLoadingCourse(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = () => {
    navigate(`/checkout?course=${slug}`);
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  if (isLoadingCourse) {
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
                    <div className="relative aspect-auto overflow-hidden bg-muted">
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
                          {course.expiry
                            ? `${formatDistanceToNow(course.expiry)}`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <BarChart className="w-4 h-4" />
                          Skill Level
                        </span>
                        <span className="font-medium text-foreground capitalize">
                          {course.skill_level || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Language
                        </span>
                        <span className="font-medium text-foreground">
                          {course.language || "N/A"}
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
                      course.curriculum.map((chapter, chapterIndex) => (
                        <div
                          key={chapterIndex}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleChapter(chapterIndex)}
                            className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">
                                {chapter.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {chapter.topics?.length || 0} topics
                              </span>
                              {expandedChapters[chapterIndex] ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </button>

                          {expandedChapters[chapterIndex] && (
                            <div className="border-t border-border">
                              {chapter.topics?.map((topic, topicIndex) => (
                                <div
                                  key={topicIndex}
                                  className={`flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors ${
                                    topicIndex !== chapter.topics.length - 1
                                      ? "border-b border-border/50"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <Play className="w-4 h-4 text-primary" />
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
                  <div className="space-y-6">
                    {/* Instructor Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {INSTRUCTORS.map((instructor) => (
                        <Card
                          key={instructor.id}
                          className="group hover:shadow-xl transition-all duration-300 hover:border-secondary/50 overflow-hidden"
                        >
                          <CardContent className="p-6">
                            {/* Instructor Image */}
                            <div className="mb-4">
                              <div className="relative w-24 h-24 mx-auto">
                                {instructor.image ? (
                                  <img
                                    src={instructor.image}
                                    alt={instructor.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors">
                                    <User className="w-12 h-12 text-primary/60" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Instructor Info */}
                            <div className="text-center space-y-3">
                              <div>
                                <h4 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                                  {instructor.name}
                                </h4>
                                <p className="text-secondary font-medium">
                                  {instructor.subject}
                                </p>
                              </div>

                              <div className="space-y-2 pt-3 border-t border-border">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                  <Award className="w-4 h-4 text-secondary" />
                                  <span>
                                    {instructor.experience} experience
                                  </span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                  <BookOpen className="w-4 h-4 text-secondary" />
                                  <span>{instructor.students}+ students</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
