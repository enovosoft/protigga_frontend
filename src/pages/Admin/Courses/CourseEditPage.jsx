import AdminLayout from "@/components/shared/AdminLayout";
import FileUpload from "@/components/shared/FileUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import api from "@/lib/api";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Edit,
  Loader2,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// Simple validation function
const validateCourseForm = (formData) => {
  const errors = [];

  if (!formData.course_title?.trim()) {
    errors.push("Course title is required");
  }
  if (!formData.batch?.trim()) {
    errors.push("Batch is required");
  }
  if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
    errors.push("Please enter a valid price greater than 0");
  }
  if (!formData.thumbnail?.trim()) {
    errors.push("Please upload a thumbnail");
  }
  if (!formData.academy_name?.trim()) {
    errors.push("Academy name is required");
  }
  if (!formData.description?.trim()) {
    errors.push("Description is required");
  }
  if (!formData.skill_level) {
    errors.push("Please select a skill level");
  }
  if (!formData.expired_date) {
    errors.push("Expired date is required");
  }

  return errors;
};

export default function CourseEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isCreating = !slug || slug === "new";
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [books, setBooks] = useState([]);

  // Loading states for chapter and topic operations
  const [savingChapter, setSavingChapter] = useState(false);
  const [savingTopic, setSavingTopic] = useState(false);
  const [deletingChapter, setDeletingChapter] = useState(null);
  const [deletingTopic, setDeletingTopic] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [relatedBooksDialogOpen, setRelatedBooksDialogOpen] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");

  // Dialog states
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    batch: "",
    course_title: "",
    price: "",
    thumbnail: "",
    academy_name: "",
    description: "",
    related_books: [],
    quiz_count: "",
    assessment: false,
    skill_level: "",
    expired_date: "",
    is_featured: false,
  });

  const [chapterForm, setChapterForm] = useState({
    title: "",
  });

  const [topicForm, setTopicForm] = useState({
    title: "",
    youtube_url: "",
  });

  // Fetch books for related book dropdown
  const fetchBooks = useCallback(async () => {
    try {
      const response = await api.get("/books");
      if (response.data.success) {
        setBooks(response.data.books || []);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      // Don't show error toast for books fetch, just keep empty
    }
  }, []);

  // Fetch course data
  const fetchCourse = useCallback(
    async (isRefresh = false) => {
      try {
        const response = await api.get(`/control/course/${slug}`);
        if (response.data.success) {
          const courseData = response.data.course;
          setCourse(courseData);
          setChapters(courseData.chapters || []);

          // Set course form data
          setCourseForm({
            batch: courseData.batch || "",
            course_title: courseData.course_title || "",
            price: courseData.price || "",
            thumbnail: courseData.thumbnail || "",
            academy_name: courseData.course_details?.academy_name || "",
            description: courseData.course_details?.description || "",
            related_books: courseData.related_books || [],
            quiz_count: courseData.course_details?.quiz_count || "",
            assessment: courseData.course_details?.assessment || false,
            skill_level: courseData.course_details?.skill_level || "",
            expired_date: courseData.course_details?.expired_date
              ? new Date(courseData.course_details.expired_date)
                  .toISOString()
                  .split("T")[0]
              : "",
            is_featured: courseData.is_featured || false,
          });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to fetch course details");
        if (!isRefresh) {
          navigate("/admin/courses");
        }
      } finally {
        setLoading(false);
      }
    },
    [slug, navigate]
  );

  useEffect(() => {
    if (isCreating) {
      // For creating new course, initialize form and set loading to false
      setCourseForm({
        batch: "",
        course_title: "",
        price: "",
        thumbnail: "",
        academy_name: "",
        description: "",
        related_books: [],
        quiz_count: "",
        assessment: false,
        skill_level: "",
        expired_date: "",
        is_featured: false,
      });
      setLoading(false);
    } else {
      // For editing, fetch course data
      fetchCourse();
    }
    fetchBooks();
  }, [isCreating, slug, fetchCourse, fetchBooks]);

  // Handle course form changes
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCourseSelectChange = (name, value) => {
    setCourseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (url) => {
    setCourseForm((prev) => ({
      ...prev,
      thumbnail: url,
    }));
  };

  // Save course details
  const saveCourseDetails = async () => {
    // Simple validation
    const errors = validateCourseForm(courseForm);
    if (errors.length > 0) {
      toast.error(errors[0]); // Show first error
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...courseForm,
        expired_date: `${courseForm.expired_date}T00:00:00.000Z`,
        related_books: courseForm.related_books,
        related_book:
          courseForm.related_books.length > 0
            ? courseForm.related_books[0]
            : "null",
        quiz_count:
          courseForm.quiz_count === "" || courseForm.quiz_count === undefined
            ? null
            : parseInt(courseForm.quiz_count),
        price: parseFloat(courseForm.price),
      };

      let response;
      if (isCreating) {
        // Create new course
        response = await api.post(`/course`, payload);
      } else {
        // Update existing course
        response = await api.put(`/course`, payload);
      }

      if (response.data.success) {
        toast.success(response.data.message || "Course operation successful!");
        if (isCreating) {
          // Navigate to the edit page of the newly created course
          navigate(`/admin/courses/${response.data.course.slug}`);
        } else {
          // Update local course data
          setCourse((prev) => ({
            ...prev,
            course_title: courseForm.course_title,
            batch: courseForm.batch,
            price: courseForm.price,
            thumbnail: courseForm.thumbnail,
            is_featured: courseForm.is_featured,
            related_books: courseForm.related_books,
            course_details: {
              ...prev.course_details,
              academy_name: courseForm.academy_name,
              description: courseForm.description,
              quiz_count: courseForm.quiz_count,
              assessment: courseForm.assessment,
              skill_level: courseForm.skill_level,
              expired_date: courseForm.expired_date,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(error.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Chapter management
  const handleAddChapter = () => {
    setEditingChapter(null);
    setChapterForm({ title: "" });
    setChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setChapterForm({ title: chapter.title });
    setChapterDialogOpen(true);
  };

  const saveChapter = async () => {
    if (!chapterForm.title.trim()) {
      toast.error("Chapter title is required");
      return;
    }

    setSavingChapter(true);
    try {
      let response;
      if (editingChapter) {
        // Update chapter
        response = await api.put(`/chapter`, {
          course_id: course.course_id,
          chapter_id: editingChapter.chapter_id,
          title: chapterForm.title,
        });
        if (response.data.success) {
          // Update local state
          setChapters((prev) =>
            prev.map((ch) =>
              ch.chapter_id === editingChapter.chapter_id
                ? { ...ch, title: chapterForm.title }
                : ch
            )
          );
          toast.success("Chapter updated successfully");
        }
      } else {
        // Add new chapter
        response = await api.post(`/chapter`, {
          course_id: course.course_id,
          title: chapterForm.title,
        });
        if (response.data.success) {
          // Add to local state
          setChapters((prev) => [
            ...prev,
            {
              chapter_id: response.data.chapter.chapter_id,
              title: response.data.chapter.title,
              topics: [],
            },
          ]);
          toast.success("Chapter added successfully");
        }
      }

      setChapterDialogOpen(false);
      setEditingChapter(null);
      setChapterForm({ title: "" });
    } catch (error) {
      console.error("Error saving chapter:", error);
      toast.error(error.response?.data?.message || "Failed to save chapter");
    } finally {
      setSavingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapter) => {
    setDeletingChapter(chapter.chapter_id);
    try {
      await api.delete(`/chapter/${chapter.chapter_id}`);
      // Remove from local state
      setChapters((prev) =>
        prev.filter((ch) => ch.chapter_id !== chapter.chapter_id)
      );
      toast.success("Chapter deleted successfully");
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error(error.response?.data?.message || "Failed to delete chapter");
    } finally {
      setDeletingChapter(null);
    }
  };

  // Topic management
  const handleAddTopic = (chapter) => {
    setEditingTopic(null);
    setTopicForm({ title: "", youtube_url: "" });
    setEditingChapter(chapter); // Store the chapter for topic creation
    setTopicDialogOpen(true);
  };

  const handleEditTopic = (topic, chapter) => {
    setEditingTopic(topic);
    setEditingChapter(chapter);
    setTopicForm({
      title: topic.title,
      youtube_url: topic.youtube_url,
    });
    setTopicDialogOpen(true);
  };

  const saveTopic = async () => {
    if (!topicForm.title.trim()) {
      toast.error("Topic title is required");
      return;
    }
    if (!topicForm.youtube_url.trim()) {
      toast.error("YouTube URL is required");
      return;
    }

    // Validate YouTube URL format
    const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/;
    if (!youtubeUrlPattern.test(topicForm.youtube_url.trim())) {
      toast.error(
        "Please enter a valid YouTube URL in the format: https://www.youtube.com/watch?v=VIDEO_ID"
      );
      return;
    }

    setSavingTopic(true);
    try {
      let response;
      if (editingTopic) {
        // Update topic
        response = await api.put(`/topic`, {
          chapter_id: editingChapter.chapter_id,
          chapter_topic_id: editingTopic.chapter_topic_id,
          title: topicForm.title,
          youtube_url: topicForm.youtube_url,
        });
        if (response.data.success) {
          // Update local state
          setChapters((prev) =>
            prev.map((ch) =>
              ch.chapter_id === editingChapter.chapter_id
                ? {
                    ...ch,
                    topics: ch.topics.map((topic) =>
                      topic.chapter_topic_id === editingTopic.chapter_topic_id
                        ? {
                            ...topic,
                            title: topicForm.title,
                            youtube_url: topicForm.youtube_url,
                          }
                        : topic
                    ),
                  }
                : ch
            )
          );
          toast.success("Topic updated successfully");
        }
      } else {
        // Add new topic
        response = await api.post(`/topic`, {
          chapter_id: editingChapter.chapter_id,
          title: topicForm.title,
          youtube_url: topicForm.youtube_url,
        });
        if (response.data.success) {
          // Add to local state
          setChapters((prev) =>
            prev.map((ch) =>
              ch.chapter_id === editingChapter.chapter_id
                ? { ...ch, topics: [...(ch.topics || []), response.data.topic] }
                : ch
            )
          );
          toast.success("Topic added successfully");
        }
      }

      setTopicDialogOpen(false);
      setEditingTopic(null);
      setTopicForm({ title: "", youtube_url: "" });
      setEditingChapter(null);
    } catch (error) {
      console.error("Error saving topic:", error);
      toast.error(error.response?.data?.message || "Failed to save topic");
    } finally {
      setSavingTopic(false);
    }
  };

  const handleDeleteTopic = async (topic) => {
    setDeletingTopic(topic.chapter_topic_id);
    try {
      await api.delete(`/topic/${topic.chapter_topic_id}`);
      // Remove from local state
      setChapters((prev) =>
        prev.map((ch) =>
          ch.chapter_id === editingChapter.chapter_id
            ? {
                ...ch,
                topics: ch.topics.filter(
                  (t) => t.chapter_topic_id !== topic.chapter_topic_id
                ),
              }
            : ch
        )
      );
      toast.success("Topic deleted successfully");
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error(error.response?.data?.message || "Failed to delete topic");
    } finally {
      setDeletingTopic(null);
    }
  };

  // Delete confirmation
  const handleDeleteClick = (item, type) => {
    setItemToDelete({ item, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      const { item, type } = itemToDelete;
      if (type === "chapter") {
        await handleDeleteChapter(item);
      } else if (type === "topic") {
        await handleDeleteTopic(item);
      }

      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      // Error handling is done in individual functions
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Toggle chapter expansion
  const toggleChapterExpansion = (chapterId) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Course Details Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>

          {/* Lectures Section Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!isCreating && !course) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate("/admin/courses")}>
            Back to Courses
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/courses")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Button>
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground text-center">
                {isCreating ? "Add New Course" : "Edit Course"}
              </h1>
              {!isCreating && course && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {course.course_title}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Course Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course_title">
                  <span className="text-primary">Course Title</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="course_title"
                  name="course_title"
                  value={courseForm.course_title}
                  onChange={handleCourseChange}
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">
                  <span className="text-primary">Batch</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="batch"
                  name="batch"
                  value={courseForm.batch}
                  onChange={handleCourseChange}
                  placeholder="Enter batch name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  <span className="text-primary">Price (BDT)</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={courseForm.price}
                  onChange={handleCourseChange}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academy_name">
                  <span className="text-primary">Academy Name</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="academy_name"
                  name="academy_name"
                  value={courseForm.academy_name}
                  onChange={handleCourseChange}
                  placeholder="Enter academy name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill_level">
                  <span className="text-primary">Skill Level</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={courseForm.skill_level}
                  onValueChange={(value) =>
                    handleCourseSelectChange("skill_level", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expired_date">
                  <span className="text-primary">Expired Date</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expired_date"
                  name="expired_date"
                  type="date"
                  value={courseForm.expired_date}
                  onChange={handleCourseChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiz_count">Quiz Count</Label>
                <Input
                  id="quiz_count"
                  name="quiz_count"
                  type="number"
                  value={courseForm.quiz_count}
                  onChange={handleCourseChange}
                  placeholder="Enter quiz count"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="related_books">Related Books</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRelatedBooksDialogOpen(true)}
                  className="w-full justify-between"
                >
                  <span>
                    {courseForm.related_books.length > 0
                      ? `${courseForm.related_books.length} book(s) selected`
                      : "Select related books"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                <span className="text-primary">Description</span>{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={courseForm.description}
                onChange={handleCourseChange}
                placeholder="Enter course description"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="assessment"
                name="assessment"
                checked={courseForm.assessment}
                onCheckedChange={(checked) =>
                  setCourseForm((prev) => ({ ...prev, assessment: checked }))
                }
              />
              <Label htmlFor="assessment">Has Assessment</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                name="is_featured"
                checked={courseForm.is_featured}
                onCheckedChange={(checked) =>
                  setCourseForm((prev) => ({ ...prev, is_featured: checked }))
                }
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="is_featured" className="cursor-help">
                      Featured on Homepage
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Check this to display this course on the homepage featured
                      section
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>
                <span className="text-primary">Thumbnail: </span>{" "}
                <span className="text-destructive">*</span>
              </Label>

              <FileUpload
                onUploadSuccess={handleImageUpload}
                currentImage={courseForm.thumbnail}
                accept="image/*"
                supportedTypes="jpg, jpeg, png"
                autoUpload={true}
                showLabel={false}
              />
            </div>

            <Button
              onClick={saveCourseDetails}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Course Details"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lectures/Chapters Section - Only show when editing */}
        {!isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No chapters added yet. Click "Add Chapter" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter) => (
                    <Collapsible
                      key={chapter.chapter_id}
                      open={expandedChapters.has(chapter.chapter_id)}
                      onOpenChange={() =>
                        toggleChapterExpansion(chapter.chapter_id)
                      }
                    >
                      <div className="border rounded-lg p-4">
                        <CollapsibleTrigger className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2">
                          <div className="flex items-center gap-3">
                            {expandedChapters.has(chapter.chapter_id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <h3 className="font-semibold text-foreground">
                              {chapter.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              ({chapter.topics?.length || 0} topics)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-7 sm:ml-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddTopic(chapter);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span className="hidden sm:inline">
                                Add Topic
                              </span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditChapter(chapter);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(chapter, "chapter");
                              }}
                              disabled={deletingChapter === chapter.chapter_id}
                              className="flex items-center gap-1 text-destructive hover:text-destructive"
                            >
                              {deletingChapter === chapter.chapter_id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                              <span className="hidden sm:inline">
                                {deletingChapter === chapter.chapter_id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
                            </Button>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-4">
                          {chapter.topics && chapter.topics.length > 0 ? (
                            <div className="space-y-2 pl-7">
                              {chapter.topics.map((topic) => (
                                <div
                                  key={topic.chapter_topic_id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/30 rounded-md gap-2"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <Play className="w-4 h-4 text-primary flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-foreground truncate">
                                        {topic.title}
                                      </p>
                                      <p className="text-sm text-muted-foreground break-all">
                                        {topic.youtube_url}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditTopic(topic, chapter)
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span className="hidden sm:inline">
                                        Edit
                                      </span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteClick(topic, "topic")
                                      }
                                      disabled={
                                        deletingTopic === topic.chapter_topic_id
                                      }
                                      className="flex items-center gap-1 text-destructive hover:text-destructive"
                                    >
                                      {deletingTopic ===
                                      topic.chapter_topic_id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                      <span className="hidden sm:inline">
                                        {deletingTopic ===
                                        topic.chapter_topic_id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground text-sm pl-7">
                              No topics added yet. Click "Add Topic" to add
                              video lectures.
                            </div>
                          )}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              )}

              {/* Add Chapter Button at Bottom */}
              <div className="flex justify-center pt-4 border-t border-border">
                <Button
                  onClick={handleAddChapter}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Chapter</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chapter Dialog */}
        <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingChapter ? "Edit Chapter" : "Add Chapter"}
              </DialogTitle>
              <DialogDescription>
                {editingChapter
                  ? "Update the chapter title."
                  : "Create a new chapter for this course."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chapter_title">
                  <span className="text-primary">Chapter Title</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="chapter_title"
                  value={chapterForm.title}
                  onChange={(e) =>
                    setChapterForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter chapter title"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setChapterDialogOpen(false)}
                disabled={savingChapter}
              >
                Cancel
              </Button>
              <Button onClick={saveChapter} disabled={savingChapter}>
                {savingChapter ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingChapter ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  `${editingChapter ? "Update" : "Add"} Chapter`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Topic Dialog */}
        <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTopic ? "Edit Topic" : "Add Topic"}
              </DialogTitle>
              <DialogDescription>
                {editingTopic
                  ? "Update the topic details."
                  : "Add a new video topic to this chapter."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic_title">
                  <span className="text-primary">Topic Title</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic_title"
                  value={topicForm.title}
                  onChange={(e) =>
                    setTopicForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter topic title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">
                  <span className="text-primary">YouTube URL</span>{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="youtube_url"
                  value={topicForm.youtube_url}
                  onChange={(e) =>
                    setTopicForm((prev) => ({
                      ...prev,
                      youtube_url: e.target.value,
                    }))
                  }
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a valid YouTube URL in the format:
                  https://www.youtube.com/watch?v=VIDEO_ID
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTopicDialogOpen(false)}
                disabled={savingTopic}
              >
                Cancel
              </Button>
              <Button onClick={saveTopic} disabled={savingTopic}>
                {savingTopic ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingTopic ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  `${editingTopic ? "Update" : "Add"} Topic`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Related Books Selection Dialog */}
        <Dialog
          open={relatedBooksDialogOpen}
          onOpenChange={setRelatedBooksDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select Related Books</DialogTitle>
              <DialogDescription>
                Choose books that are related to this course. You can select
                multiple books.
              </DialogDescription>
            </DialogHeader>

            {/* Search Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search books..."
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <svg
                  className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Books List */}
              <div className="max-h-96 overflow-y-auto border rounded-md p-3 space-y-2">
                {books.length > 0 ? (
                  books
                    .filter((book) =>
                      book.title
                        .toLowerCase()
                        .trim()
                        .includes(bookSearchQuery.toLowerCase())
                    )
                    .map((book) => (
                      <div
                        key={book.book_id || book.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md"
                      >
                        <Checkbox
                          id={`dialog-book-${book.book_id || book.id}`}
                          checked={courseForm.related_books.includes(
                            book.book_id || book.id
                          )}
                          onCheckedChange={(checked) => {
                            setCourseForm((prev) => ({
                              ...prev,
                              related_books: checked
                                ? [
                                    ...prev.related_books,
                                    book.book_id || book.id,
                                  ]
                                : prev.related_books.filter(
                                    (id) => id !== (book.book_id || book.id)
                                  ),
                            }));
                          }}
                        />
                        <Label
                          htmlFor={`dialog-book-${book.book_id || book.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <div className="font-medium">{book.title}</div>
                          {book.author && (
                            <div className="text-xs text-muted-foreground">
                              by {book.author}
                            </div>
                          )}
                        </Label>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No books available
                  </p>
                )}
                {books.length > 0 &&
                  books.filter((book) =>
                    book.title
                      .toLowerCase()
                      .includes(bookSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No books match your search
                    </p>
                  )}
              </div>

              {/* Selection Summary */}
              <div className="text-sm text-muted-foreground">
                {courseForm.related_books.length} book(s) selected
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRelatedBooksDialogOpen(false);
                  setBookSearchQuery("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setRelatedBooksDialogOpen(false);
                  setBookSearchQuery("");
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the{" "}
                <span className="font-semibold text-foreground">
                  {itemToDelete?.type === "chapter" ? "chapter" : "topic"}
                </span>{" "}
                <span className="font-semibold text-foreground">
                  "{itemToDelete?.item?.title}"
                </span>
                . This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
